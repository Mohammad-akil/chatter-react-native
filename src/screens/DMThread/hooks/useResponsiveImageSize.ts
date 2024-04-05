import { useEffect, useState } from 'react';
import { normalize } from '~/utils/normalize';

export const useResponsiveImageSize = (imageWidth: number, imageHeight: number, width: number, height: number) => {
  const [responsiveImage, setResponsiveImage] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (imageWidth && imageHeight) {
      if (imageWidth > imageHeight) {
        setResponsiveImage({ width: width * 0.7, height: height * 0.2 });
      } else if (imageWidth < imageHeight) {
        setResponsiveImage({ width: width * 0.6, height: height * 0.5 });
      } else {
        setResponsiveImage({ width: normalize(200), height: normalize(200) });
      }
    }
  }, [imageWidth, imageHeight, width, height]);

  return responsiveImage;
};
