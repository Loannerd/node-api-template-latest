import mongoose, { Schema } from "mongoose"
import { IDocumentUpload } from "./Upload.types"

const schema = new Schema(
  {
    url: {
      type: String,
      required: true,
      index: true,
    }
  }
)

const UploadRepo = mongoose.model<IDocumentUpload>("uploads", schema)
export default UploadRepo