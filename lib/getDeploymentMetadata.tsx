import { ipfs } from "@decent.xyz/sdk";

const loadImage = async (ipfsUri: any) => {
  const response = await fetch(ipfsUri);
  const blob = await response.blob();
  const file = new File([blob], "image", { type: blob.type });
  return file;
};

const getDeploymentMetadata = async ({
  name,
  image,
  description,
  title,
  audioFile,
  mimeType = "",
  artwork = null,
  visualizer = null,
  tags = null,
  credits = null,
  attributes = null,
  project = null,
  artist = null,
  genre = null,
  recordLabel = null,
  license = null,
  publisher = null,
  locationCreated = null,
  originalReleaseDate = null,
  bpm = null,
  duration = null,
  isrc = null,
  key = null,
  external_url = null,
  trackNumber = null,
  lyrics = null,
}: any) => {
  const metadata = {
    image: image.raw,
    name,
    mimeType,
    description,
    version: "0.1.0",
    title,
    animation_url: image.animation_url,
    losslessAudio: audioFile.losslessAudio,
    visualizer,
    artwork,
    tags,
    credits,
    attributes,
    project,
    artist,
    genre,
    recordLabel,
    license,
    publisher,
    locationCreated,
    originalReleaseDate,
    bpm,
    duration,
    isrc,
    key,
    external_url,
    trackNumber,
    lyrics,
  };
  if (audioFile.raw) {
    metadata.mimeType = mimeType || audioFile.raw.type;
    metadata.animation_url = audioFile.raw;
    if (metadata.mimeType.includes("wav")) {
      metadata.losslessAudio = audioFile.raw;
    }
  } else {
    metadata.mimeType = image?.raw?.type;
  }
  if (artwork) {
    if (artwork.raw) {
      metadata.artwork = {
        uri: artwork.raw,
        mimeType: artwork.raw.type,
      };
    } else {
      const artworkFile = await loadImage(artwork.preview);
      metadata.artwork = {
        uri: artworkFile,
        mimeType: artworkFile.type,
      };
    }
  }
  if (visualizer) {
    if (visualizer.raw) {
      metadata.visualizer = {
        uri: visualizer.raw,
        mimeType: visualizer.raw.type,
      };
    } else {
      const visualizerFile = await loadImage(visualizer.preview);
      metadata.visualizer = {
        uri: visualizerFile,
        mimeType: visualizerFile.type,
      };
    }
  }
  if (!metadata.image) {
    metadata.image = await loadImage(image.preview);
  }
  if (metadata?.project?.artwork.uri) {
    if (metadata.project.artwork.uri.raw) {
      metadata.project.artwork.mimeType = metadata.project.artwork.uri.raw.type;
      metadata.project.artwork.uri = metadata.project.artwork.uri.raw;
    } else {
      const response = await loadImage(metadata.project.artwork.uri.preview);
      metadata.project.artwork.uri = response;
      metadata.project.artwork.mimeType = response.type;
    }
  }
  const ipfsHash = await ipfs.createMetadata(metadata);
  return ipfsHash;
};

export default getDeploymentMetadata;