import { useState } from "react";
import { timeSlots } from "@/data/content";
import { useApp } from "@/lib/store";
import { MonthCalendar } from "./calendar";
import { BottomSheet, Chip, PrimaryButton, SecondaryButton } from "./primitives";

export function useAppointmentActions() {
  const { updateAppointment, pushToast } = useApp();
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [error, setError] = useState("");

  const sheets = (
    <>
      <BottomSheet open={Boolean(cancelId)} title="Cancel appointment" onClose={() => setCancelId(null)}>
        <p className="text-[15px] leading-[22px] text-muted">
          This removes the visit from your upcoming list. You can book again any time.
        </p>
        <PrimaryButton
          className="mt-4 bg-danger text-white shadow-none"
          onClick={() => {
            if (!cancelId) return;
            updateAppointment(cancelId, { status: "cancelled" });
            pushToast("Appointment cancelled");
            setCancelId(null);
          }}
        >
          Confirm cancel
        </PrimaryButton>
        <SecondaryButton className="mt-2" onClick={() => setCancelId(null)}>
          Keep appointment
        </SecondaryButton>
      </BottomSheet>
      <BottomSheet
        open={Boolean(rescheduleId)}
        title="Reschedule"
        onClose={() => {
          setRescheduleId(null);
          setError("");
        }}
      >
        <div className="max-h-[65dvh] space-y-3 overflow-y-auto pb-2">
          <MonthCalendar value={date} onChange={setDate} />
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((slot) => (
              <Chip key={slot} active={time === slot} onClick={() => setTime(slot)}>
                {slot}
              </Chip>
            ))}
          </div>
          {error ? <p className="text-xs text-danger">{error}</p> : null}
          <PrimaryButton
            onClick={() => {
              if (!date || !time || !rescheduleId) {
                setError("Choose a date and a time window.");
                return;
              }
              updateAppointment(rescheduleId, { date, time, flexible: false, status: "pending" });
              pushToast("Appointment rescheduled", "Status is pending until the crew confirms.");
              setRescheduleId(null);
              setError("");
            }}
          >
            Save new time
          </PrimaryButton>
        </div>
      </BottomSheet>
    </>
  );

  return {
    sheets,
    requestCancel: (id: string) => setCancelId(id),
    requestReschedule: (id: string) => {
      setDate(null);
      setTime(null);
      setError("");
      setRescheduleId(id);
    },
  };
}
