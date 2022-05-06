import { MailAdapter } from "../adapters/mail-adapter";
import { FeedbacksRepository } from "../repositories/feedbacks-repository";

interface SubmitFeedbackServiceRequest {
    type: string,
    comment: string,
    screenshot?: string,
}

export class SubmitFeedbackService {
    constructor(
        private feedbacksRepository: FeedbacksRepository,
        private mailAdapter: MailAdapter,
    ) { }

    async execute(request: SubmitFeedbackServiceRequest) {
        const { type, comment, screenshot } = request;

        if(!type){
            throw new Error('Sem tipo informado')
        }
        if(!comment){
            throw new Error('Sem comentario')
        }
        if (screenshot && !screenshot.startsWith('data:image/png;base64')) {
            throw new Error('Formato invalido')
        }

        await this.feedbacksRepository.create({
            type,
            comment,
            screenshot,
        });

        await this.mailAdapter.sendMail({
            subject: 'Novo feedback',
            body: [
                `<div style='font-family: sans-serif; font-size: 16px; color:#111;'>`,
                `<p>Tipo do feedback: ${type}</p>`,
                `<p>Commentario: ${comment}</p>`,
                screenshot ? `<img src=${screenshot}` : null,
                `</div>`
            ].join('\n')
        })
    }
}