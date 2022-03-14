const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate-v2');
require('dotenv').config();

const LogSchema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
    method: {
      type: String,
    },
    error: {
      type: Object,
    },
    header: {
      type: Object,
    },
    body: {
      type: Object,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Log = mongoose.model('Log', LogSchema);

export default Log;
