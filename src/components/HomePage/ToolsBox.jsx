"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react';

function ToolsBox({ notepadContent, setNotepadContent, onClose }) {
    // Estado para la posición inicial y actual del bloc de notas
    // Se inicializa en una posición fija (ej. centro de la pantalla)
    // o se carga desde localStorage si existe
    const [position, setPosition] = useState(() => {
        const storedPos = localStorage.getItem('notepadPosition');
        if (storedPos) {
            try {
                return JSON.parse(storedPos);
            } catch (e) {
                console.error("Error parsing notepadPosition from localStorage", e);
            }
        }
        return { x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 100 };
    });

    // Estado para el tamaño inicial y actual del bloc de notas
    const [size, setSize] = useState(() => {
        const storedSize = localStorage.getItem('notepadSize');
        if (storedSize) {
            try {
                return JSON.parse(storedSize);
            } catch (e) {
                console.error("Error parsing notepadSize from localStorage", e);
            }
        }
        return { width: 400, height: 300 };
    });

    const notepadRef = useRef(null); // Referencia al div principal del bloc de notas para medir su tamaño
    const isDragging = useRef(false); // Bandera para saber si estamos arrastrando
    const isResizing = useRef(null); // Bandera para saber si estamos redimensionando (ej. 'se' para sureste)
    const dragStartCoords = useRef({ x: 0, y: 0 }); // Coordenadas de inicio del arrastre/redimensionamiento
    const initialPos = useRef({ x: 0, y: 0 }); // Posición inicial al empezar a arrastrar/redimensionar
    const initialSize = useRef({ width: 0, height: 0 }); // Tamaño inicial al empezar a redimensionar

    // Guardar posición y tamaño en localStorage cada vez que cambian
    useEffect(() => {
        localStorage.setItem('notepadPosition', JSON.stringify(position));
    }, [position]);

    useEffect(() => {
        localStorage.setItem('notepadSize', JSON.stringify(size));
    }, [size]);

    const handleMouseDown = useCallback((e) => {
        if (e.target.classList.contains('handle') || e.target.closest('.handle')) {
            isDragging.current = true;
            dragStartCoords.current = { x: e.clientX, y: e.clientY };
            initialPos.current = { x: position.x, y: position.y };
            e.preventDefault(); // Prevenir selección de texto
        }
    }, [position]);

    // Manejar el redimensionamiento
    const handleResizeMouseDown = useCallback((e, direction) => {
        isResizing.current = direction;
        dragStartCoords.current = { x: e.clientX, y: e.clientY };
        initialSize.current = { width: size.width, height: size.height };
        initialPos.current = { x: position.x, y: position.y }; // Necesario si redimensionamos desde esquinas/lados que cambian la posición
        e.stopPropagation(); // Evitar que el clic en el handle propague al arrastre
        e.preventDefault(); // Prevenir selección de texto
    }, [size, position]);

    const handleMouseMove = useCallback((e) => {
        if (isDragging.current) {
            const dx = e.clientX - dragStartCoords.current.x;
            const dy = e.clientY - dragStartCoords.current.y;
            setPosition({
                x: initialPos.current.x + dx,
                y: initialPos.current.y + dy,
            });
            e.preventDefault();
        } else if (isResizing.current) {
            const dx = e.clientX - dragStartCoords.current.x;
            const dy = e.clientY - dragStartCoords.current.y;
            let newWidth = initialSize.current.width;
            let newHeight = initialSize.current.height;
            let newX = initialPos.current.x;
            let newY = initialPos.current.y;

            const minWidth = 200; // Ancho mínimo del bloc de notas
            const minHeight = 150; // Alto mínimo del bloc de notas

            switch (isResizing.current) {
                case 'se': // Sureste: cambia width y height
                    newWidth = Math.max(minWidth, initialSize.current.width + dx);
                    newHeight = Math.max(minHeight, initialSize.current.height + dy);
                    break;
                case 's': // Sur: cambia solo height
                    newHeight = Math.max(minHeight, initialSize.current.height + dy);
                    break;
                case 'e': // Este: cambia solo width
                    newWidth = Math.max(minWidth, initialSize.current.width + dx);
                    break;
                case 'sw': // Suroeste: cambia width y height, y la posición X
                    newWidth = Math.max(minWidth, initialSize.current.width - dx);
                    newHeight = Math.max(minHeight, initialSize.current.height + dy);
                    newX = initialPos.current.x + dx; // Mueve el bloc de notas a la derecha al redimensionar a la izquierda
                    break;
                case 'nw': // Noroeste: cambia width, height, y la posición X e Y
                    newWidth = Math.max(minWidth, initialSize.current.width - dx);
                    newHeight = Math.max(minHeight, initialSize.current.height - dy);
                    newX = initialPos.current.x + dx;
                    newY = initialPos.current.y + dy;
                    break;
                case 'n': // Norte: cambia height y la posición Y
                    newHeight = Math.max(minHeight, initialSize.current.height - dy);
                    newY = initialPos.current.y + dy;
                    break;
                case 'w': // Oeste: cambia width y la posición X
                    newWidth = Math.max(minWidth, initialSize.current.width - dx);
                    newX = initialPos.current.x + dx;
                    break;
                case 'ne': // Noreste: cambia width, height, y la posición Y
                    newWidth = Math.max(minWidth, initialSize.current.width + dx);
                    newHeight = Math.max(minHeight, initialSize.current.height - dy);
                    newY = initialPos.current.y + dy;
                    break;
                default:
                    break;
            }

            // Asegurarse de que el bloc de notas no se haga demasiado pequeño
            if (newWidth < minWidth) {
                newWidth = minWidth;
                if (isResizing.current.includes('w')) {
                    newX = initialPos.current.x + (initialSize.current.width - minWidth);
                }
            }
            if (newHeight < minHeight) {
                newHeight = minHeight;
                if (isResizing.current.includes('n')) {
                    newY = initialPos.current.y + (initialSize.current.height - minHeight);
                }
            }

            setSize({ width: newWidth, height: newHeight });
            setPosition({ x: newX, y: newY });
            e.preventDefault();
        }
    }, [position, size]); // Dependencias para useCallback

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
        isResizing.current = null;
    }, []);

    // Adjuntar y limpiar event listeners globales
    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]); // Dependencias para useEffect

    // Asegurarse de que el contenido del notepad se guarde al escribir
    const handleNotepadChange = (e) => {
        setNotepadContent(e.target.value);
    };

    return (
        <div
            ref={notepadRef}
            className="fixed bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
                minWidth: '200px', // Mínimos para evitar que se colapse
                minHeight: '150px',
                zIndex: 9999, // Asegura que esté siempre encima
                cursor: isDragging.current ? 'grabbing' : (isResizing.current ? 'grabbing' : 'default')
            }}
        >
            {/* Encabezado para arrastrar */}
            <div
                className="handle background-boxes-interior p-3 flex justify-between items-center cursor-grab text-white font-bold select-none"
                onMouseDown={handleMouseDown} // Atachar el evento de arrastre aquí
            >
                <h3>Bloc de Notas</h3>
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Evitar que el clic se propague al div contenedor
                        onClose();
                    }}
                    className="text-white hover:text-gray-200 focus:outline-none"
                    aria-label="Cerrar bloc de notas"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            {/* Área de texto */}
            <textarea
                className="w-full h-full p-4 resize-none focus:outline-none flex-grow"
                value={notepadContent}
                onChange={handleNotepadChange}
                placeholder="Escribe tus notas aquí..."
            ></textarea>

            {/* Handles de redimensionamiento */}
            {['se', 's', 'e', 'sw', 'nw', 'n', 'w', 'ne'].map(direction => (
                <div
                    key={direction}
                    className={`resize-handle resize-handle-${direction}`}
                    onMouseDown={(e) => handleResizeMouseDown(e, direction)}
                ></div>
            ))}
        </div>
    );
}

export default ToolsBox;