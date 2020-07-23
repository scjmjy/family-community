import m from 'mongoose'
import { IImageDoc } from './types/image_types'

const ImageSchema = new m.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    url: {
        type: String
    },
    urlThumb: {
        type: String
    },
    gallery: {
        type: m.Schema.Types.ObjectId,
        ref: 'Gallery'
    },
    family: { // 如果存在，表明该图片属于这个家庭的，而非某一个用户
        type: m.Schema.Types.ObjectId,
        ref: 'Family'
    },
    user: { // 如果存在，表明该图片属于这个用户的
        type: m.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        type: m.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // likesCount: {
    //     type: Number,
    // }
    comments: [
        {
            user: {
                type: m.Schema.Types.ObjectId,
                ref: 'User'
            },
            comment: String
        }
    ]
}, {
    timestamps: true
})

// ImageSchema.pre<ImageDoc>('save', function (next) {
//     next()
// })

const ImageModel = m.model<IImageDoc>('Image', ImageSchema)
export default ImageModel
