/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateTaskRequestBody, IResultModificationData, ITaskUpdatedEvent, } from '../types';
import { KafkaTopics } from '../types/kafkaTopics';
import { ApiError } from '../utils/ApiError';
import prisma from '../utils/db';
import { kafkaProducer } from './kafka.service';

/**
 * TaskService - Handles all task-related business logic
 */
export default abstract class TaskService {
  static updateTask = async (body: ITaskUpdatedEvent): Promise<void> => {
    await kafkaProducer.send({
      topic: KafkaTopics.TASK_UPDATED,
      messages: [
        {
          value: JSON.stringify(body),
        },
      ],
    });
  };
  /**
   * Creates a new task by sending to Kafka topic
   * @param body Task creation data
   */
  static createTask = async (body: CreateTaskRequestBody): Promise<void> => {
    await kafkaProducer.send({
      topic: KafkaTopics.TASK_CREATED,
      messages: [
        {
          value: JSON.stringify(body),
        },
      ],
    });
  };

  /**
   * Deletes a task by sending to Kafka topic
   * @param param0 Object containing taskId and email of requesting user
   */
  static deleteTask = async ({
    taskId,
    email,
  }: {
    taskId: string;
    email: string;
  }): Promise<void> => {
    await kafkaProducer.send({
      topic: KafkaTopics.TASK_DELETED,
      messages: [
        {
          value: JSON.stringify({ taskId, email }),
        },
      ],
    });
  };

  /**
   * Retrieves all tasks from database
   * @returns Array of tasks
   */
  static getAllTasks = async (): Promise<CreateTaskRequestBody[]> => {
    try {
      const tasks = await prisma.task.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          priority: true,
          status: true,
          dueDate: true,
          userId: true,
          assignedUser: {
            select: {
              username: true,
              id: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      if (tasks.length === 0) {
        return [];
      }

      return tasks;
    } catch (er: any) {
      throw new ApiError(er.statusCode, er);
    }
  };

  /**
   * Retrieves all task history records
   * @returns Array of task history records
   */
  static getAllTaskHistory = async (): Promise<IResultModificationData[]> => {
    try {
      const tasks = await prisma.taskHistory.findMany({
        select: {
          taskId: true,
          changeType: true,
          previousValue: {
            select: {
              user: {
                id: true,
                username: true,
                email: true,
              },
              task: {
                id: true,
                title: true,
                description: true,
                priority: true,
                status: true,
                dueDate: true,
                userId: true,
                assignedTo: {
                  username: true,
                  id: true,
                },
              },
            },
          },
          newValue: {
            select: {
              user: {
                id: true,
                username: true,
                email: true,
              },
              task: {
                id: true,
                title: true,
                description: true,
                priority: true,
                status: true,
                dueDate: true,
                userId: true,
                assignedTo: {
                  username: true,
                  id: true,
                },
              },
            },
          },
        },
      });
  
      // Transform to match IResultModificationData
      const formattedTasks: IResultModificationData[] = tasks.map((t) => ({
        taskId: t.taskId,
        changeType: t.changeType,
        previousValue: {
          user: {
            id: t.previousValue.user.id,
            email: t.previousValue.user.email,
          },
          task: {
            id: t.previousValue.task.id,
            title: t.previousValue.task.title,
            description: t.previousValue.task.description,
            priority: t.previousValue.task.priority,
            status: t.previousValue.task.status,
            dueDate: t.previousValue.task.dueDate,
            userId: t.previousValue.task.userId,
            assignedUser: {
              id: t.previousValue.task.assignedTo.id,
              username: t.previousValue.task.assignedTo.username,
            },
            user: {
              id: t.previousValue.user.id,
              email: t.previousValue.user.email,
            },
          },
        },
        newValue: {
          user: {
            id: t.newValue.user.id,
            email: t.newValue.user.email,
          },
          task: {
            id: t.newValue.task.id,
            title: t.newValue.task.title,
            description: t.newValue.task.description,
            priority: t.newValue.task.priority,
            status: t.newValue.task.status,
            dueDate: t.newValue.task.dueDate,
            userId: t.newValue.task.userId,
            assignedUser: {
              id: t.newValue.task.assignedTo.id,
              username: t.newValue.task.assignedTo.username,
            },
            user: {
              id: t.newValue.user.id,
              email: t.newValue.user.email,
            },
          },
        },
      }));
  
      return formattedTasks;
    } catch (er: any) {
      throw new ApiError(er.statusCode, er);
    }
  };
}
