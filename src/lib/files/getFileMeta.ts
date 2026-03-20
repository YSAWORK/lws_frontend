// .src/lib/getFileMeta.ts

// IMPORT TOOLS
import ImageFormImg from '@/assets/img/file_format/image.svg'
import PdfFormImg from '@/assets/img/file_format/pdf.svg'
import UnFormImg from '@/assets/img/file_format/unknown.svg'
import SheetFormImg from '@/assets/img/file_format/sheet.svg'
import VideoFormImg from '@/assets/img/file_format/video.svg'
import AudioFormImg from '@/assets/img/file_format/audio.svg'
import DocumentFormImg from '@/assets/img/file_format/document.svg'
import PresentformImg from '@/assets/img/file_format/presentation.svg'
import ArchiveFormImg from '@/assets/img/file_format/archive.svg'


// Карта метаданих файлу
export type FileMeta = {
    name: string
    baseName: string
    extension: string
    group: ReturnType<typeof getFileGroup>
    icon: string
    sizeBytes: number
    sizeFormatted: string
    mimeType: string
    lastModified: number
    previewable: boolean
}

// Функція отримання метаданих файлу
export function getFileMeta(file: File): FileMeta {
    const name = file.name
    const baseName = name.replace(/\.[^/.]+$/, "")
    const extension = extractExtension(name)
    const group = getFileGroup(extension)
    const icon = getFileIcon(extension)
    return {
        name,
        baseName,
        extension,
        group,
        icon,
        sizeBytes: file.size,
        sizeFormatted: formatFileSize(file.size),
        mimeType: file.type,
        lastModified: file.lastModified,
        previewable: isPreviewableGroup(group)
    }
}

// Функція отримання розширення файлу по назві
export function extractExtension(filename: string): string {
    if (!filename.includes(".")) return ""
    return filename.split(".").pop()?.toLowerCase() ?? ""
}

// Групи файлів за розширенням
type FileGroup =
    | "document"
    | "spreadsheet"
    | "presentation"
    | "image"
    | "video"
    | "audio"
    | "archive"
    | "pdf"
    | "other"


// Розподілення файлів по групам по розширенням
const FILE_GROUPS: Record<FileGroup, string[]> = {
    document: [
        "doc","docx","dot","dotx",
        "odt","ott",
        "rtf",
        "txt","text",
        "md","markdown",
        "pages",
        "wpd",
        "tex",
        "epub"
    ],
    spreadsheet: [
        "xls","xlsx","xlsm","xlsb",
        "ods","ots",
        "csv",
        "tsv",
        "numbers"
    ],
    presentation: [
        "ppt","pptx","pptm",
        "pps","ppsx",
        "odp","otp",
        "key"
    ],
    image: [
        "jpg","jpeg","jpe",
        "png",
        "gif",
        "webp",
        "svg",
        "bmp",
        "tiff","tif",
        "ico",
        "heic","heif",
        "avif"
    ],
    video: [
        "mp4","m4v",
        "webm",
        "mov",
        "avi",
        "mkv",
        "ogv",
        "3gp","3g2"
    ],
    audio: [
        "mp3",
        "m4a","aac",
        "wav",
        "ogg",
        "oga",
        "flac",
        "aiff","aif",
        "opus"
    ],
    archive: [
        "zip",
        "rar",
        "7z",
        "tar",
        "gz",
        "bz2",
        "xz",
        "tgz",
        "tbz2"
    ],
    pdf: [
        "pdf"
    ],
    other: [
        "json",
        "xml",
        "yaml","yml",
        "log",
        "ini",
        "cfg"
    ]
}


// Отримати назву групи файлу
export function getFileGroup(extension?: string): FileGroup {
    if (!extension) return "other"
    const ext = extension.replace(".", "").toLowerCase()
    for (const [group, extensions] of Object.entries(FILE_GROUPS)) {
        if (extensions.includes(ext)) {
            return group as FileGroup
        }
    }

    return "other"
}


// Отримати розмір файлу
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`
    }
    if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}


// Перевірити можливість preview
export function isPreviewableGroup(group: FileGroup): boolean {
    return ["image", "pdf", "video", "audio"].includes(group)
}

export function isPreviewable(input: File | string): boolean {
    if (input instanceof File) {
        return isPreviewableGroup(getFileGroup(extractExtension(input.name)))
    }
    return isPreviewableGroup(getFileGroup(input))
}


// В залежності від mime-типу файлу, обирає відповідну іконку
export function getFileIcon(extension?: string): string {
    const group = getFileGroup(extension)

    const icons: Record<FileGroup, string> = {
        document: DocumentFormImg,
        spreadsheet: SheetFormImg,
        presentation: PresentformImg,
        image: ImageFormImg,
        video: VideoFormImg,
        audio: AudioFormImg,
        archive: ArchiveFormImg,
        pdf: PdfFormImg,
        other: UnFormImg
    }

    return icons[group]
}