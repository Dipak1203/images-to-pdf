import React, { ChangeEventHandler } from "react";
import * as Helpers from "./utils/helper.utils";
import { CustomImage } from "./Components/CustomImage";
import {
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Input,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

function App() {
  const [uploadedImages, setUploadedImages] = React.useState<CustomImage[]>([]);

  const handleImageUpload: ChangeEventHandler<HTMLInputElement> = (event) => {
    const fileList = event.target.files;
    const fileArray = fileList ? Array.from(fileList) : [];
    const fileToImagePromises = fileArray.map(Helpers.fileToImageURL);

    Promise.all(fileToImagePromises).then(setUploadedImages);
  };

  const cleanUpUploadedImages = () => {
    setUploadedImages([]);
    uploadedImages.forEach((image) => {
      URL.revokeObjectURL(image.src);
    });
  };

  const generatePdfFromImages = () => {
    Helpers.generatePdfFromImages(uploadedImages);
    cleanUpUploadedImages();
  };

  return (
    <Box>
      <Flex direction="column" align="center" justify="center" minH="100vh">
        {/* <Heading mb={4}>Convert images to PDFs</Heading> */}

        <Wrap spacing={4} justify="center">
          {uploadedImages.length > 0 ? (
            uploadedImages.map((image) => (
              <WrapItem key={image.src}>
                <img
                  src={image.src}
                  width={"100px"} // Set the desired width
                  height={"100px"} // Set the desired height
                  alt="Uploaded"
                  style={{ objectFit: "cover" }} // Optional: maintain aspect ratio
                />
              </WrapItem>
            ))
          ) : (
            <Heading>Upload some images...</Heading>
          )}
        </Wrap>
        <Flex direction="column" align="center" mt={4}>
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

          {uploadedImages.length > 0 && (
            <Button
              onClick={generatePdfFromImages}
              colorScheme="teal"
              variant="solid"
              mt={4}
            >
              View PDF
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

export default App;
