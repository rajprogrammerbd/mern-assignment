import { KafkaTopics } from '../types/kafkaTopics';
import prisma from '../utils/db';
import { kafkaConsumer } from './kafka.service';
import { getIO } from '../routes/socket.route';
import { IResultModificationData } from '../types';
import TaskService from './task.service';

export default async function startKafkaConsumer() {
  await kafkaConsumer.connect();

  const io = getIO();

  await kafkaConsumer.subscribe({
    topic: KafkaTopics.TASK_CREATED,
    fromBeginning: true,
  });
  await kafkaConsumer.subscribe({
    topic: KafkaTopics.TASK_UPDATED,
    fromBeginning: true,
  });
  await kafkaConsumer.subscribe({
    topic: KafkaTopics.TASK_DELETED,
    fromBeginning: true,
  });

  kafkaConsumer.run({
    eachMessage: async ({ topic, message }) => {
      const eventData = JSON.parse(message.value!.toString());

      if (topic === KafkaTopics.TASK_CREATED) {
        const [user, assignedUser] = await Promise.all([
          prisma.user.findUnique({ where: { id: eventData.userId } }),
          prisma.user.findUnique({ where: { id: eventData.assignedTo } }),
        ]);
        
        if (!user || !assignedUser) {
          console.error('User or assigned user not found:', {
            userId: eventData.userId,
            assignedTo: eventData.assignedTo,
          });
          return; // Skip task creation or handle accordingly
        }
  
        const data = await prisma.task.create({
          data: {
            title: eventData.title,
            description: eventData.description,
            priority: eventData.priority,
            status: eventData.status,
            dueDate: new Date(eventData.dueDate),
            assignedUser: {
              connect: {
                id: eventData.assignedTo,
              },
            },
            user: {
              connect: {
                id: eventData.userId,
              },
            },
          },
          select: {
            id: true,
            title: true,
            description: true,
            priority: true,
            status: true,
            dueDate: true,
            assignedUser: {
              select: {
                username: true,
                id: true,
              },
            },
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        });

        io.emit('task-created', data);
      } else if (topic === KafkaTopics.TASK_UPDATED) {
        console.log('eventData', eventData);
        const previousValue = await prisma.task.findUnique({
          where: { id: eventData.taskId },
        });
        
        const data = await prisma.task.update({
          where: { id: eventData.taskId },
          data: eventData.fieldChange,
        });


        await prisma.taskHistory.create({
          data: {
            taskId: eventData.taskId,
            changeType: 'UPDATED',
            previousValue,
            newValue: data,
          },
        });

        const user = await prisma.user.findUnique({
          where: { id: eventData.userId },
          select: {
            id: true,
            username: true,
            email: true,
          },
        });

          const result: IResultModificationData = {
            taskId: eventData.taskId,
            changeType: 'UPDATED',
            previousValue: { user, task: previousValue },
            newValue: { user, task: data },
          };

          // First log the history, then delete the task separately
          await prisma.taskHistory.create({ data: result });

          const allTasks = await TaskService.getAllTasks();

          io.emit('task-updated', { allTasks, result });
      } else if (topic === KafkaTopics.TASK_DELETED) {
        console.log('deleted', eventData);
        try {
          const { taskId, email } = eventData;

          const user = await prisma.user.findUnique({ where: { email } });
          const task = await prisma.task.findUnique({ where: { id: taskId } });

          if (!user || !task) {
            console.warn('Missing user or task during deletion:', {
              taskId,
              email,
            });
            return;
          }

          const result: IResultModificationData = {
            taskId,
            changeType: 'DELETED',
            previousValue: { user, task },
            newValue: { user, task },
          };

          // First log the history, then delete the task separately
          await prisma.taskHistory.create({ data: result });
          await prisma.task.delete({ where: { id: taskId } });

          const allTasks = await TaskService.getAllTasks();

          io.emit('task-deleted', { allTasks, result });
        } catch (error) {
          console.error('Error handling TASK_DELETED:', error);
        }
      }
    },
  });
}
