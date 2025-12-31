import React, { useRef, useState, useCallback } from 'react';
import useKeyboardSound from '../../hooks/useKeyboardSound';
import { useChatStore } from '../../store/useChatStore';
import toast from 'react-hot-toast';
import { ImageIcon, XIcon } from 'lucide-react';

function ChatInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const { sendMessage, isSoundEnabled } = useChatStore();

  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const handleSendMessage = useCallback(
    (e) => {
      e.preventDefault();
      if (!text.trim() && !imagePreview) return;

      if (isSoundEnabled) playRandomKeyStrokeSound();
      if (imagePreview && !text.trim()) {
        sendMessage({
          text: "hidden_written_text@$$@123",
          image: imagePreview,
        });
      }
      sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText('');
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [text, imagePreview, isSoundEnabled, playRandomKeyStrokeSound, sendMessage]
  );

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const removeImage = useCallback(() => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  return (
    <div className="p-4 border-t border-gray-700/50 bg-gray-900 h-20">
      {/* Image preview */}
      {imagePreview && (
        <div className="relative max-w-3xl mx-auto mb-3 w-fit">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-24 h-24 object-cover rounded-xl border border-gray-600 shadow-md"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full 
                       bg-red-600 flex items-center justify-center 
                       text-white hover:bg-red-500 transition"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input + buttons */}
      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex items-center space-x-3"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={() => isSoundEnabled && playRandomKeyStrokeSound()}
          className="flex-1 bg-gray-800/70 border border-gray-600 rounded-2xl py-3 px-4 
                     outline-none placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 transition"
          placeholder="Type a message..."
        />

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`p-3 rounded-xl transition
            ${imagePreview
              ? 'bg-cyan-700 text-white shadow-md hover:bg-cyan-600'
              : 'bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-700'}`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default ChatInput;