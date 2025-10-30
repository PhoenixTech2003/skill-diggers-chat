import { observable } from "@legendapp/state";

interface MeetingState {
  localParticipant: {
    micOn: boolean;
    webcamOn: boolean;
  };
}

export const meetingState$ = observable<MeetingState>({
  localParticipant: {
    micOn: true,
    webcamOn: true,
  },
});
