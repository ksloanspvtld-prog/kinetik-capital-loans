export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919765435411?text=Hello%20Kinetik%20Capital,%20I%20need%20assistance%20with%20loan%20options."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl animate-pulse transition">

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="currentColor"
          className="w-8 h-8"
        >
          <path d="M16.001 3C8.82 3 3 8.82 3 16c0 2.29.6 4.53 1.74 6.5L3 29l6.72-1.7A12.94 12.94 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.6c-1.97 0-3.89-.53-5.56-1.53l-.4-.24-3.99 1.01 1.07-3.89-.26-.41A10.54 10.54 0 1 1 16 26.6zm5.78-7.9c-.32-.16-1.9-.94-2.19-1.05-.29-.11-.5-.16-.71.16-.21.32-.82 1.05-1 1.26-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.77-2.2-.18-.32-.02-.49.14-.65.15-.15.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.71-.98-2.35-.26-.62-.53-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.32-1.11 1.08-1.11 2.64 0 1.55 1.14 3.05 1.3 3.26.16.21 2.24 3.42 5.42 4.8.76.33 1.35.53 1.81.68.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.53.27-.76.27-1.41.19-1.53-.08-.13-.29-.21-.61-.37z" />
        </svg>

      </div>
    </a>
  );
}