import { SubmitFeedbackService } from "./submit-feedback-service";

const createFeedbackSpy = jest.fn();
const sendMailSpy = jest.fn();

const submitFeedback = new SubmitFeedbackService(
    { create: createFeedbackSpy },
    { sendMail: sendMailSpy }
);

describe('Submit feedback', () => {
    test('Deve poder submitar um feedback', async () => {
        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: 'batata',
            screenshot: 'data:image/png;base64exemplo.jpg',
        })).resolves.not.toThrow();

        expect(createFeedbackSpy).toHaveBeenCalled();
        expect(sendMailSpy).toHaveBeenCalled();
    })

    test('Não deve ser possivel enviar sem tipo', async () => {
        await expect(submitFeedback.execute({
            type: '',
            comment: 'batata',
            screenshot: 'data:image/png;base64exemplo.jpg',
        })).rejects.toThrow();
    })

    test('Não deve ser possivel enviar sem comentario', async () => {
        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: '',
            screenshot: 'data:image/png;base64exemplo.jpg',
        })).rejects.toThrow();
    })

    test('Não deve ser possivel enviar com uma imagem invalida', async () => {
        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: 'batata',
            screenshot: 'exemplo.jpg',
        })).rejects.toThrow();
    })
});