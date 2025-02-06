const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
const videoExtensions = ['mp4','mp3', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'];

function getFileCategory(filename: string): { category: string; color: string } {
  const extension = filename.split('.').pop()?.toLowerCase();

  if (!extension) {
    return { category: 'Unknown', color: 'red' };
  }

  if (imageExtensions.includes(extension)) {
    return { category: 'Image', color: 'pink' };
  }
  if (documentExtensions.includes(extension)) {
    return { category: 'Documents', color: 'blue' };
  }
  if (videoExtensions.includes(extension)) {
    return { category: 'Video', color: 'green' };
  }

  return { category: 'Other', color: 'orange' };
}

export default getFileCategory;
