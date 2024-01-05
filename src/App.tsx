import React, { ChangeEventHandler } from "react";
import * as Helpers from "./utils/helper.utils";
import { CustomImage } from "./Components/CustomImage";
import { Flex, Box, Heading, Button, Input, Wrap, WrapItem } from "@chakra-ui/react";
import { saveAs } from "file-saver";

function App() {
  const [uploadedImages, setUploadedImages] = React.useState<CustomImage[]>([]);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [pdfBlob, setPdfBlob] = React.useState<Blob | null>(null);

  const handleImageUpload: ChangeEventHandler<HTMLInputElement> = (event) => {
    const fileList = event.target.files;
    handleFileList(fileList);
  };

  const handleFileList = (fileList: FileList | null) => {
    const fileArray = fileList ? Array.from(fileList) : [];
    const fileToImagePromises = fileArray.map(Helpers.fileToImageURL);

    Promise.all(fileToImagePromises).then(setUploadedImages);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const fileList = event.dataTransfer.files;
    handleFileList(fileList);
  };

  const cleanUpUploadedImages = () => {
    setUploadedImages([]);
    uploadedImages.forEach((image) => {
      URL.revokeObjectURL(image.src);
    });
  };

  const generatePdfFromImages = () => {
    const pdfBlob = Helpers.generatePdfFromImages(uploadedImages);
    setPdfBlob(pdfBlob);
    openPdfInNewTab(pdfBlob);
  };

  const handleDownloadPdf = () => {
    if (pdfBlob) {
      saveAs(pdfBlob, "dipak-pdf.pdf");
      cleanUpUploadedImages();
    }
  };

  const openPdfInNewTab = (blob: Blob) => {
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, "_blank");
  };

  return (
    <Box bg="">
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        bg="#1A202C"
        color={"#fff"}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragging ? "2px dashed #008080" : "2px dashed #A0AEC0",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        {uploadedImages.length === 0 && <Heading mb={4}>Drag & Drop Images</Heading>}

        <Wrap spacing={4} justify="center">
          {uploadedImages.length > 0 &&
            uploadedImages.map((image) => (
              <WrapItem key={image.src}>
                <img
                  src={image.src}
                  width={"100px"}
                  height={"100px"}
                  alt="Uploaded"
                  style={{ objectFit: "cover" }}
                />
              </WrapItem>
            ))}
        </Wrap>

        <Flex direction="column" align="center" mt={10}>
          {uploadedImages.length === 0 && (
            <label htmlFor="file-input">
              <Button as="span" colorScheme="teal" variant="outline">
                Upload images
              </Button>
              <Input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                display="none"
                multiple
              />
            </label>
          )}

          {uploadedImages.length > 0 && (
            <>
              <Button
                onClick={generatePdfFromImages}
                colorScheme="teal"
                variant="solid"
                mt={4}
              >
                View PDF
              </Button>
              <Button
                onClick={handleDownloadPdf}
                colorScheme="teal"
                variant="outline"
                mt={4}
              >
                Download PDF
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

export default App;
