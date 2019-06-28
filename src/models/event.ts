import mongoose, { Schema, model, Model, Document } from "mongoose";

export interface EventImpl extends Document {
  name: string;
  createdBy: mongoose.Types.ObjectId;
  about: string;
  body: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  participants: mongoose.Types.ObjectId[];
  venue: string;
  imageLink: string;
  updates: mongoose.Types.ObjectId[];
  // staredCount: number;
}

const eventSchema = new Schema(
  {
    name: {
      type: String
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    about: {
      type: String
    },
    body: {
      type: Schema.Types.ObjectId,
      ref: "Body"
    },
    venue: {
      type: String,
      required: true
    },
    imageLink: {
      type: String
    },
    startDate: {
      type: Date,
      // required: true,
      default: Date.now
    },
    endDate: {
      type: Date
      // required: true
    },
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }]
    },
    updates: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Update"
        }
      ]
    }
    // staredCount: {
    //   type: Number,
    //   default: 0
    // }
  },
  { timestamps: true }
);

// eventSchema.methods.eventJSOn = function() {
//   return {
//     name: this.name,
//     about: this.about,
//     body: this.body
//   };
// };

// eventSchema.methods.updateStaredCount = async function() {
//   const count = await User.count({
//     staredEvents: { $in: [this._id] }
//   });
//   this.staredCount = count;
// };

const Event: Model<EventImpl> = model<EventImpl>("Event", eventSchema);

export default Event;
