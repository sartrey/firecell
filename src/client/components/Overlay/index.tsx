import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import './index.less';

const Singleton: {
  ref?: React.RefObject<IOverlayHandler>;
} = {};

export interface IOverlayPropsForPopover {
  anchor?: string;
  position?: {
    x: number;
    y: number;
  }
}

export interface IOverlayProps {
  title?: string;
  content?: React.ReactNode;
  popover?: IOverlayPropsForPopover;
}

export interface IOverlayHandler {
  modal: (props: IOverlayProps) => void;
  toast: (props: IOverlayProps) => void;
  popup: (props: IOverlayProps) => void;
}

function OverlaySlot(props: {}, ref: React.Ref<unknown> | undefined): React.ReactElement {
  const [statePopup, setStatePopup] = useState<IOverlayProps>();
  const [stateModal, setStateModal] = useState<IOverlayProps>();
  const [stateToasts, setStateToasts] = useState<IOverlayProps[]>([]);

  useImperativeHandle(ref, () => {
    return {
      modal: (props: IOverlayProps) => {
        setStateModal(props);
      },

      popup: (props: IOverlayProps) => {
        const popoverProps = props.popover;
        let popoverPosition = popoverProps?.position;
        if (!popoverPosition) {
          if (popoverProps?.anchor) {
            const element = document.querySelector(popoverProps.anchor);
            if (!element) { return; }
            const rect = element.getBoundingClientRect();
            popoverPosition = { x: rect.x, y: rect.y };
            // TODO: support align
            popoverPosition.y += rect.height + 8;
          }
        }
        setStatePopup({ ...props, popover: { ...popoverProps, position: popoverPosition } });
      },

      toast: (props: IOverlayProps) => {
        const nextToasts = stateToasts.concat(props);
        setStateToasts(nextToasts);
      }
    };
  });

  useEffect(() => {
    Singleton.ref = ref as React.RefObject<IOverlayHandler>;
    const clickOutOfOverlay = (e: MouseEvent) => {
      const outOfOverlay = e.target instanceof HTMLElement && !e.target.closest('.overlay');
      if (!outOfOverlay) { return; }
      setStatePopup(undefined);
    };
    document.addEventListener('click', clickOutOfOverlay, true);
    return () => {
      document.removeEventListener('click', clickOutOfOverlay);
    };
  }, []);

  return (
    <div className="overlay">
      {stateModal && (
        <div className="modal">
          <div className="header">
            <div className="title">{stateModal.title}</div>
            <a className="close material-icons" onClick={() => setStateModal(undefined)}>close</a>
          </div>
          <div className="content">{stateModal.content}</div>
        </div>
      )}
      {statePopup && (
        <div className="popup" style={{
          left: `${statePopup.popover?.position?.x || 0}px`,
          top: `${statePopup.popover?.position?.y || 0}px`
        }}>
          {statePopup.content}
        </div>
      )}
      {stateToasts.map(toastItem => {
        return (
          <div className="toast">
            <div className="title">{toastItem.title}</div>
            <div className="content"></div>
          </div>
        );
      })}
    </div>
  );
}

export const Overlay = forwardRef(OverlaySlot);

export function useOverlay(): IOverlayHandler {
  // TODO: use Proxy
  return {
    modal: (props: IOverlayProps) => {
      const { ref } = Singleton;
      if (ref) {
        ref.current?.modal(props);
      }
    },

    popup: (props: IOverlayProps) => {
      const { ref } = Singleton;
      if (ref) {
        ref.current?.popup(props);
      }
    },

    toast: (props: IOverlayProps) => {
      const { ref } = Singleton;
      if (ref) {
        ref.current?.toast(props);
      }
    }
  };
}
