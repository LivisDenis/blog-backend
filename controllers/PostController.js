import PostModel from "../models/Post.js";

const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()
        res.json(posts)
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}
const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findByIdAndUpdate(
            {
                _id: postId
            },
            {
                $inc: {viewsCount: 1}
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Нe удалось получить статью'
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    })
                }

                res.json(doc)
            }
        ).populate('user')
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось получить статью'
        })
    }
}
const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            user: req.userId,
            imageUrl: req.body.imageUrl,
        })

        const post = await doc.save()

        res.json(post)
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}
const remove = (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findByIdAndDelete(
            {
                _id: postId
            },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Нe удалось удалить статью'
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    })
                }

                res.json({
                    success: true,
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось удалить статью'
        })
    }
}
const update = async (req, res) => {
    try {
        const postId = req.params.id

        await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                user: req.userId,
                imageUrl: req.body.imageUrl,
            }
        )

        res.json({
            update: true
        })
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}

export default {
    create,
    getAll,
    getOne,
    update,
    remove
}