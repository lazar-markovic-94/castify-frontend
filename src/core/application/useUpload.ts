import { useMutation } from '@tanstack/react-query';
import { uploadRepository } from '../data/repositories/uploadRepository';

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadRepository.uploadImage(file),
  });
};
