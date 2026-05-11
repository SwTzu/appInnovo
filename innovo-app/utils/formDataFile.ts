import { Platform } from "react-native";

type FileOptions = {
  type?: string;
  name?: string;
};

const defaultFileNameFor = (uri: string, fallbackName: string) => {
  const cleanUri = uri.split("?")[0] || uri;
  const lastSegment = cleanUri.split("/").pop();

  return lastSegment && lastSegment.includes(".") ? lastSegment : fallbackName;
};

const appendWebFile = async (
  formData: FormData,
  fieldName: string,
  uri: string,
  { type = "image/jpeg", name = "upload.jpg" }: FileOptions
) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const fileName = defaultFileNameFor(uri, name);
  const fileType = blob.type || type;

  if (typeof File !== "undefined") {
    formData.append(fieldName, new File([blob], fileName, { type: fileType }));
    return;
  }

  formData.append(fieldName, blob, fileName);
};

export const appendFormDataFile = async (
  formData: FormData,
  fieldName: string,
  uri: string,
  options: FileOptions = {}
) => {
  const type = options.type || "image/jpeg";
  const name = options.name || "upload.jpg";

  if (Platform.OS === "web") {
    await appendWebFile(formData, fieldName, uri, { type, name });
    return;
  }

  formData.append(fieldName, {
    uri,
    type,
    name,
  } as any);
};
