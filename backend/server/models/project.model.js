import mongoose from "mongoose";

const { Schema } = mongoose;

const ProjectSchema = new mongoose.Schema (
    {
        projectSlug: {
            type: String,
            unique: true,
            index: true,
            required: true,
            trim: true,
            lowercase: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        rootFolderId: {
            type: Schema.Types.ObjectId,
            ref: "File",
            default: null
        },
        settings: {
            framework: {
                type: String,
                default: "react"
            },
            autoSave: {
                type: Boolean,
                default: true
            }
        }
    },
    {timestamps: true}
);

const Project = mongoose.model("Project", ProjectSchema);
export default Project;