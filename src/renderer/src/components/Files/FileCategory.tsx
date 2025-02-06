const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp']
const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']
const videoExtensions = ['mp4', 'mp3', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm']

function getFileCategory(filename: string): { category: string; color: string } {
    if (!filename.includes('.')) {
        return { category: 'Folder', color: 'purple' }
    }
    const extension = filename.split('.').pop()?.toLowerCase()
    if (extension && imageExtensions.includes(extension)) {
        return { category: 'Images', color: 'pink' }
    }
    if (extension && documentExtensions.includes(extension)) {
        return { category: 'Documents', color: 'blue' }
    }
    if (extension && videoExtensions.includes(extension)) {
        return { category: 'Videos', color: 'green' }
    }

    return { category: 'Other', color: 'orange' }
}

export default getFileCategory
