import React, { useState, useEffect, } from 'react';
import './Alert.scss';

export default function Alert(props) {
  const { children, theme, onClose, } = props;

  const closeAlert = () => {
    if (onClose) onClose();
  }

  useEffect(() => {
    setTimeout(() => {
      closeAlert();
    }, 3000);
  }, []);

  return (
    <div className={`alert theme-${theme}`}>
      <div className='content'>{children}</div>
      <div className='close'>
        <a onClick={closeAlert}>
          <i className='md-icons'>close</i>
        </a>
      </div>
    </div>
  );
}

Alert.AlertHub = function AlertHub(props) {
  const { onMount } = props;
  const [alerts, setAlerts] = useState([]);
  const [count, setCount] = useState(0);

  const append = (alert) => {
    alert.index = count;
    const next = alerts.concat(alert);
    setAlerts(next);
    setCount(count + 1);
  }

  const remove = (alert) => {
    const index = alerts.indexOf(alert);
    if (index >= 0) {
      const next = alerts.filter((e, i) => i !== index);
      setAlerts(next);
    }
  }

  useEffect(() => {
    if (onMount) onMount({ append, remove });
  });

  return (
    <div className='alert-hub'>
      {alerts.map((alert) => {
        return (
          <Alert key={alert.index} theme={alert.theme} onClose={() => remove(alert)}>
            {alert.content}
          </Alert>
        );
      })}
    </div>
  );
}