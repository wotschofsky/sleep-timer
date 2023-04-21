<script lang="ts">
  import { invoke } from '@tauri-apps/api/tauri';

  import TimeInput from './lib/TimeInput.svelte';

  let startTimeInSeconds = 0;
  let remainingTimeInSeconds = 0;
  let isRunning = false;
  let shutdownMode = false;
  let timer;

  const generateDisplayLabel = (secondsLeft) => {
    let hoursLeft = Math.floor(secondsLeft / (60 * 60));
    let minutesLeft = Math.floor(secondsLeft / 60);
    if (hoursLeft >= 1) {
      return `${hoursLeft}h`;
    } else if (minutesLeft >= 1) {
      return `${minutesLeft}m`;
    } else {
      return `${secondsLeft}s`;
    }
  };

  const startTimer = () => {
    if (startTimeInSeconds === 0) {
      return;
    }

    remainingTimeInSeconds = startTimeInSeconds;
    isRunning = true;

    timer = setInterval(() => {
      remainingTimeInSeconds -= 1;

      if (remainingTimeInSeconds === 0) {
        resetTimer();

        if (!shutdownMode) {
          invoke('sleep');
        } else {
          invoke('shutdown');
        }
      }
    }, 1000);
  };

  const resetTimer = () => {
    isRunning = false;
    clearInterval(timer);
  };
</script>

<div class="container">
  <TimeInput
    on:update={(event) => (startTimeInSeconds = event.detail.timeInSeconds)}
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
            ? `${startTimeInSeconds}s`
            : '0s'}
          style:stroke-dasharray={2 * 80 * Math.PI}
          style:stroke-dashoffset={isRunning ? 2 * 80 * Math.PI : 0}
        />
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
          >{generateDisplayLabel(
            !isRunning ? startTimeInSeconds : remainingTimeInSeconds
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
