import { MessageType } from '@adiwajshing/baileys'
import request from '../../lib/request'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'
import axios from 'axios'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'tiktokuser',
            aliases: ['tik', 'tku'],
            description: 'Get the info of a user from tiktok ',
            category: 'media',
            dm: true,
            usage: `${client.config.prefix}tiktok [name]`
        })
    }
	
	    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        
        if (!joined) return void M.reply('Provide the keywords you wanna search, Baka!')
        const chitoge = joined.trim()
        console.log(chitoge)
        const { data } = await axios.get(`https://leyscoders-api.herokuapp.com/api/tiktok-stalk?username=${chitoge}1&apikey=dappakntlll`)
        if ((data as { error: string }).error) return void (await M.reply('Sorry, couldn\'t find'))
        const buffer = await request.buffer(data.result.profile_url).catch((err) => {
            return void M.reply(err.message)
        })
        while (true) {
            try {M.reply(buffer || 'š An error occurred. Please try again later',
                    MessageType.image,
                    undefined,
                    undefined,
                    `š£ *Private*:${data.result.is_private}\nš *videoscount*:${data.result.videos_coun}\nš*LIKES *:${data.result.likes}\nš *Following*:${data.result.following}\nš» *Followers*:${data.result.followers}\nš *Bio*:${data.result.biography}\nš *Fullname*:${data.result.full_name}\nš *Username*: ${data.result.username}\nš*here's id link: https://www.tiktok.com/@${data.result.username}`,
                    undefined
                ).catch((e) => {
                    console.log(`This error occurs when an image is sent via M.reply()\n Child Catch Block : \n${e}`)
                    // console.log('Failed')
                    M.reply(`šAn error occurred. Please try again later.`)
                })
                break
            } catch (e) {
                // console.log('Failed2')
                M.reply(`An error occurred. Please try again later.`)
                console.log(`This error occurs when an image is sent via M.reply()\n Parent Catch Block : \n${e}`)
            }
        }
        return void null
    }
}
