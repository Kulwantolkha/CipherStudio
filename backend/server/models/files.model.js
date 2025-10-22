import mongoose from "mongoose";

const { Schema } = mongoose;


const FileSchema = mongoose.Schema(
{
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        index: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: "File",
        default: null,
        index: true,
    },
    name: {
        type: String, 
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["file", "folder"],
        required: true
    },
    s3Key: {
        type: String,
        default: null
    },
    content: {
        type: String,
        default: ""
    },
    language: {
        type: String,
        default: "javascript",
    },
    sizeInBytes: {
        type: Number,
        default: 0,
    }
},
    {timestamps: true}
)

FileSchema.index({ projectId: 1, parentId: 1 });

const File  = mongoose.model("File", FileSchema);
export default File;