import React, { useState } from 'react';
import type { SpreadConfig } from './SpreadSelector';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  onSave: (spread: SpreadConfig) => void;
  onCancel: () => void;
}

export const CustomSpreadBuilder: React.FC<Props> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [positions, setPositions] = useState<Array<{ name: string; description: string }>>([
    { name: '', description: '' }
  ]);

  const handleAddPosition = () => {
    setPositions([...positions, { name: '', description: '' }]);
  };

  const handleRemovePosition = (index: number) => {
    setPositions(positions.filter((_, i) => i !== index));
  };

  const handlePositionChange = (index: number, field: 'name' | 'description', value: string) => {
    const newPositions = [...positions];
    newPositions[index][field] = value;
    setPositions(newPositions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty positions
    const validPositions = positions.filter(p => p.name.trim() && p.description.trim());
    
    if (validPositions.length < 2) {
      alert('Please add at least 2 card positions');
      return;
    }

    const customSpread: SpreadConfig = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      cardCount: validPositions.length,
      icon: 'threeCard',
      positions: validPositions,
      isCustom: true
    };

    onSave(customSpread);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">
            Create Custom Spread
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Design your own spread with custom card positions and descriptions.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Spread Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
              rows={2}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Card Positions</h3>
              <button
                type="button"
                onClick={handleAddPosition}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Position
              </button>
            </div>

            {positions.map((position, index) => (
              <div key={index} className="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Position Name
                    </label>
                    <input
                      type="text"
                      value={position.name}
                      onChange={(e) => handlePositionChange(index, 'name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <input
                      type="text"
                      value={position.description}
                      onChange={(e) => handlePositionChange(index, 'description', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                {positions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePosition(index)}
                    className="absolute -right-2 -top-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Save Spread
          </button>
        </div>
      </form>
    </div>
  );
};