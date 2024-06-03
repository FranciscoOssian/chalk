const fileSchema = {
  name: 'File',
  primaryKey: 'sha256',
  properties: {
    sha256: 'string',
    origin: 'string',
    destination: 'string',
  },
};

export default fileSchema;
