// .src/lib/getFileIcon.ts

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