import pino from 'pino';

//biblioteca para criar logs
const logger = pino({
  prettyPrint: {
    ignore: 'pid, hostname'
  }
});

export {
  logger,
}