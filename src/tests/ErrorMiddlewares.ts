import { NextFunction, Request, Response } from "express"
import { erroMiddleware } from "../middlewares/error.middleware"
import { HttpException } from "../interfaces/HttpException"

describe('Error Middleware', () => {
    it('shold respond with the correct status and message httpExeption', () => {
        const httpExeption: HttpException = {
            name: 'HttpException',
            status: 404,
            message: 'Not found'
        }
        const req: Partial<Request> = {}
        const res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const next: NextFunction = jest.fn()

        erroMiddleware(httpExeption, req as Request, res as Response, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenLastCalledWith({
            status: 404,
            message: 'Not found',
        })
    })
})