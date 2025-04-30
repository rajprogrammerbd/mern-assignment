import { JwtPayload } from '../index'; // Adjust this path if needed

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The task ID
 *         title:
 *           type: string
 *           description: The task title
 *         description:
 *           type: string
 *           description: The task description
 *         priority:
 *           $ref: '#/components/schemas/Priority'
 *         status:
 *           $ref: '#/components/schemas/Status'
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: The task due date
 *         userId:
 *           type: string
 *           description: ID of the user who created the task
 *         assignedUser:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             id:
 *               type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 *
 *     TaskCreate:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - priority
 *         - status
 *         - dueDate
 *         - userId
 *         - assignedTo
 *       properties:
 *         title:
 *           type: string
 *           description: The task title
 *         description:
 *           type: string
 *           description: The task description
 *         priority:
 *           $ref: '#/components/schemas/Priority'
 *         status:
 *           $ref: '#/components/schemas/Status'
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: The task due date
 *         userId:
 *           type: string
 *           description: ID of the user who created the task
 *         assignedTo:
 *           type: string
 *           description: ID of the user assigned to the task
 *
 *     Priority:
 *       type: string
 *       enum: [LOW, MEDIUM, HIGH]
 *       description: Task priority level
 *
 *     Status:
 *       type: string
 *       enum: [TODO, IN_PROGRESS, DONE]
 *       description: Task status
 *
 *     TaskHistory:
 *       type: object
 *       properties:
 *         taskId:
 *           type: string
 *         changeType:
 *           type: string
 *         previousValue:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *             task:
 *               $ref: '#/components/schemas/Task'
 *         newValue:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *             task:
 *               $ref: '#/components/schemas/Task'
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     WebSocketConnection:
 *       type: object
 *       properties:
 *         auth:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT access token
 *           required:
 *             - token
 *
 *     WebSocketError:
 *       type: object
 *       properties:
 *         error:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Authentication error: Token missing"
 *
 *   securitySchemes:
 *     websocketAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: JWT token for WebSocket authentication (Bearer token)
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
