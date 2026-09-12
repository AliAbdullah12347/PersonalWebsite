import React, { useState, useEffect } from 'react';
import { resumeData } from '../data/resumeData';

// Deliberately its own component, not part of Dashboard: it ticks every second,
// and re-rendering the whole dashboard tree once a second is exactly the waste
// that got removed from this file earlier.

const FOCUS_CYCLE = ['Machine Learning', 'Security', 'Real-Time Graphics'];
const NODE_TIMEZONE = 'America/New_York';

const HeroTelemetry = () => {
  const [clock, setClock] = useState(null);
  const [focusIndex, setFocusIndex] = useState(0);

  useEffect(() => {
    const format = () =>
      // en-US resolves timeZoneName: 'short' to "EDT"/"EST"; en-GB gives "GMT-4",
      // which is correct but reads like a raw offset rather than a place.
      new Intl.DateTimeFormat('en-US', {
        timeZone: NODE_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
        timeZoneName: 'short',
      }).format(new Date());

    setClock(format());
    const tick = setInterval(() => setClock(format()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const cycle = setInterval(
      () => setFocusIndex((i) => (i + 1) % FOCUS_CYCLE.length),
      3200
    );
    return () => clearInterval(cycle);
  }, []);

  return (
    <dl className="telemetry" aria-label="Current status">
      <div className="telemetry-cell">
        <dt className="telemetry-key">Local Node</dt>
        <dd className="telemetry-val">
          Hamilton, NY
          {/* Rendered client-side only, so there is no flash of a wrong timezone */}
          <span className="telemetry-clock" aria-hidden={!clock}>
            {clock || '--:--:--'}
          </span>
        </dd>
      </div>

      <div className="telemetry-cell">
        <dt className="telemetry-key">Status</dt>
        <dd className="telemetry-val">
          <span className="telemetry-beacon" aria-hidden="true" />
          Open &mdash; Summer {resumeData.targetSummer}
        </dd>
      </div>

      <div className="telemetry-cell">
        <dt className="telemetry-key">Current Post</dt>
        <dd className="telemetry-val">
          Immersive Visualization Dev
          <span className="telemetry-sub">Colgate University</span>
        </dd>
      </div>

      <div className="telemetry-cell">
        <dt className="telemetry-key">Working On</dt>
        <dd className="telemetry-val">
          <span key={focusIndex} className="telemetry-cycle">
            {FOCUS_CYCLE[focusIndex]}
          </span>
        </dd>
      </div>
    </dl>
  );
};

export default HeroTelemetry;
