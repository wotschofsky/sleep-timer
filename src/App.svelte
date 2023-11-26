<script lang="ts">
  import { invoke } from '@tauri-apps/api/tauri';

  import TimeInput from './lib/TimeInput.svelte';

  let startTime = 0;
  let selectedTimeInSeconds = 0;
  let remainingTimeInSeconds = 0;
  let isRunning = false;
  let shutdownMode = false;
  let timer: NodeJS.Timeout;

  const generateDisplayLabel = (millisecondsLeft: number) => {
    let secondsLeft = Math.floor(millisecondsLeft / 1000);
    let minutesLeft = Math.floor(secondsLeft / 60);
    let hoursLeft = Math.floor(minutesLeft / 60);

    minutesLeft -= hoursLeft * 60;
    secondsLeft -= minutesLeft * 60 + hoursLeft * 3600;

    if (hoursLeft >= 1) {
      return `${hoursLeft}h`;
    } else if (minutesLeft >= 1) {
      return `${minutesLeft}m`;
    } else {
      return `${secondsLeft}s`;
    }
  };

  const startTimer = () => {
    if (selectedTimeInSeconds === 0) {
      return;
    }

    startTime = performance.now();
    remainingTimeInSeconds = selectedTimeInSeconds;
    isRunning = true;

    timer = setInterval(() => {
      let elapsedTime = performance.now() - startTime;
      let elapsedSeconds = Math.floor(elapsedTime / 1000);
      remainingTimeInSeconds = selectedTimeInSeconds - elapsedSeconds;

      if (remainingTimeInSeconds <= 0) {
        resetTimer();

        if (!shutdownMode) {
          invoke('sleep');
        } else {
          invoke('shutdown');
        }
      }
    }, 250);
  };

  const resetTimer = () => {
    isRunning = false;
    clearInterval(timer);
  };
</script>

<div class="container">
  <TimeInput
    on:update={(event) => (selectedTimeInSeconds = event.detail.timeInSeconds)}
  />

  <div class="display">
    <div class="centerItems">
      <svg height="200" width="200">
        <circle
          cx="100"
          cy="95"
          r="80"
          stroke-width="3"
          fill="none"
          transform="rotate(-90 100 95)"
          class:running={isRunning}
          style:transition-duration={isRunning
            ? `${selectedTimeInSeconds}s`
            : '0s'}
          style:stroke-dasharray={2 * 80 * Math.PI}
          style:stroke-dashoffset={isRunning ? 2 * 80 * Math.PI : 0}
        />
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
          >{generateDisplayLabel(
            isRunning
              ? remainingTimeInSeconds * 1000
              : selectedTimeInSeconds * 1000
          )}</text
        >
      </svg>
    </div>
    <div class="centerItems">
      <label>
        Shutdown
        <input
          class="shutdownCheckbox"
          type="checkbox"
          bind:checked={shutdownMode}
        />
      </label>
    </div>
  </div>

  <div class="centerItems">
    <button on:click={!isRunning ? startTimer : resetTimer}
      >{!isRunning ? 'Start' : 'Cancel'}</button
    >
  </div>
</div>
