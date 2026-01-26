import formStyles from '@/src/design-system/styles/form/form.module.css';

export default function FormRow({children}: {children: React.ReactNode}) {
    return <div className={formStyles.formRow}>
        {children}
    </div>;
}