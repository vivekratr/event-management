'use client';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TIMEZONES } from '@/lib/constants';
import ProfileMultiSelect from './ProfileMultiSelect';
import DateTimeInput from '../common/DateTimeInput';

export default function EventForm({ formData, setFormData, profiles, formError }) {
    return (
        <div className="space-y-4 pt-4">
            <ProfileMultiSelect
                selectedIds={formData.profiles}
                onChange={(ids) => setFormData({ ...formData, profiles: ids })}
                profiles={profiles}
            />

            <div>
                <Label>Timezone</Label>
                <Select
                    value={formData.timezone}
                    onValueChange={(v) => setFormData({ ...formData, timezone: v })}
                >
                    <SelectTrigger className="mt-2">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {TIMEZONES.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                                {tz.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <DateTimeInput
                label="Start Date & Time"
                dateValue={formData.startDate}
                timeValue={formData.startTime}
                onDateChange={(d) => setFormData({ ...formData, startDate: d })}
                onTimeChange={(t) => setFormData({ ...formData, startTime: t })}
            />

            <DateTimeInput
                label="End Date & Time"
                dateValue={formData.endDate}
                timeValue={formData.endTime}
                onDateChange={(d) => setFormData({ ...formData, endDate: d })}
                onTimeChange={(t) => setFormData({ ...formData, endTime: t })}
            />

            {formError && (
                <Alert variant="destructive">
                    <AlertDescription>{formError}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
