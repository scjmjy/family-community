import m from 'mongoose'
import { IGalleryDoc, GalleryToCreate } from './types/gallery_types'

const GallerySchema = new m.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    imgs: [{
        type: m.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    family: { // 如果存在，表明该图片属于这个家庭的，而非某一个用户
        type: m.Schema.Types.ObjectId,
        ref: 'Family'
    },
    user: { // 如果存在，表明该图片属于这个用户的
        type: m.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
})

// GallerySchema.statics.create = function(req) {
//     const gallery = GalleryToCreate.fromRequest(req)
//     GalleryModel.create()
// }

const GalleryModel = m.model<IGalleryDoc>('Gallery', GallerySchema)
export default GalleryModel
