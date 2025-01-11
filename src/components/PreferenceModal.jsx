const PreferenceModal = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;
  
    const preferences = [
      { key: 'doFirst', label: 'Do first', shortcut: '↑', color: 'bg-green-500' },
      { key: 'doLater', label: 'Do later', shortcut: '→', color: 'bg-blue-500' },
      { key: 'delegate', label: 'Delegate', shortcut: '←', color: 'bg-yellow-600' },
      { key: 'eliminate', label: 'Eliminate', shortcut: '↓', color: 'bg-red-600' }
    ];
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-[#1A2333] p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Select preference</h2>
          <div className="space-y-2">
            {preferences.map(pref => (
              <button
                key={pref.key}
                onClick={() => onSelect(pref.key)}
                className={`w-full flex items-center justify-between p-2 rounded ${pref.color} hover:opacity-90`}
              >
                <span>{pref.label}</span>
                <span>Shift ⇧ + {pref.shortcut}</span>
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 text-red-500"
          >
            CLOSE
          </button>
        </div>
      </div>
    );
  };
  
  export default PreferenceModal;