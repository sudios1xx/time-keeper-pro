import React, { useEffect, useRef } from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { validateFileType, validateFileSize } from '../../../utils/validation';
import { showToast } from '../../../utils/toast-helpers';

export interface JogadorFormState {
  nome: string;
  posicao: 'goleiro' | 'zagueiro' | 'lateral' | 'meio-campo' | 'atacante' | 'tecnico' | string;
  idade: string;
  telefone: string;
  cpf: string;
  imagem: File | null;
}

interface JogadorFormProps {
  value: JogadorFormState;
  onChange: (value: JogadorFormState) => void;
}

const JogadorForm: React.FC<JogadorFormProps> = ({ value, onChange }) => {
  const imageUrlRef = useRef<string | null>(null);
  
  // Cleanup do URL.createObjectURL
  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
        imageUrlRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (value.imagem) {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
      imageUrlRef.current = URL.createObjectURL(value.imagem);
    } else {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
        imageUrlRef.current = null;
      }
    }
    
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
        imageUrlRef.current = null;
      }
    };
  }, [value.imagem]);
  
  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validar tipo
      if (!validateFileType(file)) {
        showToast.error('Tipo de arquivo inválido. Use apenas imagens (JPEG, PNG, WebP)');
        e.target.value = '';
        return;
      }
      
      // Validar tamanho
      if (!validateFileSize(file, 5)) {
        showToast.error('Imagem muito grande. Tamanho máximo: 5MB');
        e.target.value = '';
        return;
      }
    }
    
    onChange({ ...value, imagem: file });
  };

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="nome" className="text-xs sm:text-sm font-semibold text-gray-700">
            Nome Completo
          </Label>
          <Input
            id="nome"
            placeholder="Nome do jogador"
            value={value.nome}
            onChange={(e) => onChange({ ...value, nome: e.target.value })}
            className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-100"
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="cpf" className="text-xs sm:text-sm font-semibold text-gray-700">
            CPF
          </Label>
          <Input
            id="cpf"
            type="text"
            placeholder="CPF do jogador"
            value={value.cpf}
            onChange={(e) => onChange({ ...value, cpf: e.target.value })}
            className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-100"
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="imagem" className="text-xs sm:text-sm font-semibold text-gray-700">
            Foto do Jogador
          </Label>
          <div className="space-y-2">
            <Input
              id="imagem"
              type="file"
              accept="image/*"
              onChange={handleImagemChange}
              className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-100 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {value.imagem && imageUrlRef.current && (
              <div className="mt-2">
                <img
                  src={imageUrlRef.current}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="posicao" className="text-xs sm:text-sm font-semibold text-gray-700">
          Posição
        </Label>
        <select
          id="posicao"
          value={value.posicao}
          onChange={(e) => onChange({ ...value, posicao: e.target.value })}
          className="w-full h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 sm:py-2 border border-gray-200 rounded-md focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-100"
        >
          <option value="goleiro">Goleiro</option>
          <option value="zagueiro">Zagueiro</option>
          <option value="lateral">Lateral</option>
          <option value="meio-campo">Meio-campo</option>
          <option value="atacante">Atacante</option>
          <option value="tecnico">Técnico</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="idade" className="text-xs sm:text-sm font-semibold text-gray-700">
            Idade
          </Label>
          <Input
            id="idade"
            type="number"
            placeholder="Idade"
            value={value.idade}
            onChange={(e) => onChange({ ...value, idade: e.target.value })}
            className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-100"
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="telefone" className="text-xs sm:text-sm font-semibold text-gray-700">
            Telefone
          </Label>
          <Input
            id="telefone"
            placeholder="Telefone (opcional)"
            value={value.telefone}
            onChange={(e) => onChange({ ...value, telefone: e.target.value })}
            className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-100"
          />
        </div>
      </div>
    </div>
  );
};

export default JogadorForm;


