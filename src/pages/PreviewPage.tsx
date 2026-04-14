import { useSearchParams } from 'react-router-dom';

const DEFAULT_PREVIEW = 'https://codesandbox.io/embed/new?template=react-ts';

export default function PreviewPage() {
    const [searchParams] = useSearchParams();
    const url = searchParams.get('url') || DEFAULT_PREVIEW;

    return (
        <iframe
            src={url}
            className="w-full border-0 bg-black"
            style={{ height: 'calc(100vh - 56px)' }}
            title="Live Preview"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        />
    );
}
