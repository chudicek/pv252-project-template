// If you want to use types (e.g. types of messages) that are used by
// the main website and the web worker, it might be good to have those
// declared in a separate file, so that they can be imported
// from both contexts.

export type RequestComputeFileHash = {
  type: "RequestComputeFileHash";
  file: File;
};

export type ResponseProgressUpdate = {
  type: "ResponseProgressUpdate";
  remaining: number;
};

export type ResponseHashComputed = {
  type: "ResponseHashComputed";
  hash: string;
};

export type ResponseFileLengthLoaded = {
  type: "ResponseFileLengthLoaded";
  length: number;
};
