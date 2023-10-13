function downloadBlob(
  content: BlobPart,
  filename: string,
  contentType: string
) {
  // Create a blob
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);

  // Create a link to download it
  const pom = document.createElement("a");
  pom.href = url;
  pom.setAttribute("download", filename);
  pom.click();
  URL.revokeObjectURL(url);
  pom.remove();
}

export function downloadDataToCsv(arr: unknown[][], filename: string) {
  const csvBlob = arr
    .map(
      (row) =>
        row
          .map(String) // convert every value to String
          .map((v) => v.replaceAll('"', '""')) // escape double quotes
          .map((v) => `"${v}"`) // quote it
          .join(",") // comma-separated
    )
    .join("\r\n");

  downloadBlob(csvBlob, filename, "text/csv;charset=utf-8;");
  return true;
}

export function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-z0-9]/gi, "-").toLowerCase();
}
