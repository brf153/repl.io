import throttle from 'lodash.throttle';

const throttleS3Upload = throttle(
    (uploadFn: () => Promise<void>) => uploadFn(),
    5000, // 5 seconds
    { trailing: true }
);
export { throttleS3Upload };