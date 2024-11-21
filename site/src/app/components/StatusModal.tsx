import React, { useState } from 'react';

interface StatusModalProps {
    isOpen: boolean;
    currentStatus: string;
    onClose: () => void;
    onSave: (newStatus: string) => void;
}

const StatusModal: React.FC<StatusModalProps> = ({ isOpen, currentStatus, onClose, onSave }) => {
    const [newStatus, setNewStatus] = useState(currentStatus);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Modifier le statut</h2>
                <select
                    className="w-full p-2 border rounded-md"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="completed">Terminé</option>
                </select>
                <div className="flex justify-end mt-4">
                    <button className="btn-secondary mr-2" onClick={onClose}>
                        Annuler
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            onSave(newStatus);
                            onClose();
                        }}
                    >
                        Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusModal;
