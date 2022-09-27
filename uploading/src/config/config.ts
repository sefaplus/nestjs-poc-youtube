export const ServerConfig = {
  RMQ: {
    rmq_url: `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PWD}@localhost:5672`,
    uploads_queue_name: 'uploads',
  },
  port: 3000,
};

export const serverOptions = {
  cors: true,
  bodyParser: true,
};
