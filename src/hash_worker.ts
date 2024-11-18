import { AsyncSha256 } from "./sha-256.js";

import {
  RequestComputeFileHash,
  ResponseHashComputed,
  ResponseProgressUpdate,
  ResponseFileLengthLoaded,
} from "./hash_worker_messages.js";

// In this file, you can define the worker script that will compute the
// hash digest for a given file. Of course, it is up to you what kind
// of messages should the worker receive/send.

// const hasher = new AsyncSha256();
// hasher.async_digest(
//   "Some data (represented as string)",
//   (hash) => console.log(hash),
//   (remaining) => console.log(remaining),
// );

onmessage = (e) => {
  // convert to RequestComputeFileHash
  const { file } = e.data as RequestComputeFileHash; // todo check the logic of this cast

  // postMessage("Pong... " + e.data);
  // const hasher = new AsyncSha256();
  // hasher.async_digest(
  //   "Some data (represented as string)",
  //   (hash) => console.log(hash),
  //   (remaining) => console.log(remaining),
  // );

  const reader = new FileReader();
  reader.onload = () => {
    // The result should always be a string in this case.
    const fileData = reader.result as string;

    // At this point, we know how much data we have.
    // this.total = fileData.length;

    const fileLoadedResponse: ResponseFileLengthLoaded = {
      type: "ResponseFileLengthLoaded",
      length: fileData.length,
    };
    postMessage(fileLoadedResponse);

    const hasher = new AsyncSha256();
    hasher.async_digest(
      fileData,
      (hash) => {
        // We are done.
        // this.hash = hash;
        // this.remaining = 0;
        // this.elapsed = new Date().getTime() - this.#started.getTime();

        const response: ResponseHashComputed = {
          type: "ResponseHashComputed",
          hash,
        };

        postMessage(response);
      },
      (remaining) => {
        // Update progress.
        // this.remaining = remaining;
        // this.elapsed = new Date().getTime() - this.#started.getTime();

        const response: ResponseProgressUpdate = {
          type: "ResponseProgressUpdate",
          remaining,
        };

        postMessage(response);
      },
    );
  };
  reader.readAsText(file);
};
