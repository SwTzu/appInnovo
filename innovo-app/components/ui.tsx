import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontSizes, hitSlop, radius, shadows, spacing } from "@/constants/theme";

type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: Array<"top" | "right" | "bottom" | "left">;
};

export function Screen({
  children,
  scroll = false,
  style,
  contentStyle,
  edges = ["top", "left", "right"],
}: ScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView edges={edges} style={[styles.screen, style]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scrollContent, contentStyle]}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={edges} style={[styles.screen, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

type HeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AppHeader({ title, subtitle, eyebrow, icon, action, style }: HeaderProps) {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerTitleRow}>
        {icon ? <View style={styles.headerIcon}>{icon}</View> : null}
        <View style={styles.headerText}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={3}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {action ? <View style={styles.headerAction}>{action}</View> : null}
    </View>
  );
}

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
};

export function Card({ children, style, compact = false }: CardProps) {
  return <View style={[styles.card, compact && styles.cardCompact, style]}>{children}</View>;
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = PressableProps & {
  title: string;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  textStyle?: StyleProp<TextStyle>;
};

export function AppButton({
  title,
  icon,
  variant = "primary",
  loading = false,
  fullWidth = true,
  style,
  textStyle,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={hitSlop}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        styles[`button_${variant}`],
        fullWidth && styles.buttonFull,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        typeof style === "function" ? style({ pressed, hovered: false }) : style,
      ]}
      {...props}
    >
      {loading ? <ActivityIndicator color={variant === "primary" ? colors.white : colors.brand} /> : icon}
      <Text style={[styles.buttonText, styles[`buttonText_${variant}`], textStyle]} numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
}

type IconButtonProps = PressableProps & {
  icon: React.ReactNode;
  label: string;
  variant?: "solid" | "soft" | "plain" | "danger";
  size?: number;
};

export function IconButton({
  icon,
  label,
  variant = "soft",
  size = 44,
  style,
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={hitSlop}
      disabled={disabled}
      style={({ pressed }) => [
        styles.iconButton,
        styles[`iconButton_${variant}`],
        { width: size, height: size, borderRadius: size / 2 },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        typeof style === "function" ? style({ pressed, hovered: false }) : style,
      ]}
      {...props}
    >
      {icon}
    </Pressable>
  );
}

type FieldProps = TextInputProps & {
  label?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Field({ label, helper, leftIcon, style, containerStyle, ...props }: FieldProps) {
  return (
    <View style={[styles.fieldWrap, containerStyle]}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <View>
        {leftIcon ? <View style={styles.fieldIcon}>{leftIcon}</View> : null}
        <TextInput
          placeholderTextColor={colors.textSubtle}
          style={[
            styles.field,
            leftIcon ? styles.fieldWithIcon : null,
            props.multiline && styles.fieldMultiline,
            style,
          ]}
          {...props}
        />
      </View>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

type BadgeTone = "brand" | "success" | "warning" | "danger" | "neutral";

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Badge({ label, tone = "brand", icon, style }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[`badge_${tone}`], style]}>
      {icon}
      <Text style={[styles.badgeText, styles[`badgeText_${tone}`]]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  compact?: boolean;
};

export function EmptyState({ title, description, icon, compact = false }: EmptyStateProps) {
  return (
    <View style={[styles.empty, compact && styles.emptyCompact]}>
      {icon ? <View style={styles.emptyIcon}>{icon}</View> : null}
      <Text style={styles.emptyTitle}>{title}</Text>
      {description ? <Text style={styles.emptyDescription}>{description}</Text> : null}
    </View>
  );
}

type InfoRowProps = {
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
  last?: boolean;
};

export function InfoRow({ label, value, icon, last = false }: InfoRowProps) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      {icon ? <View style={styles.infoIcon}>{icon}</View> : null}
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={3}>
        {value ?? "-"}
      </Text>
    </View>
  );
}

type ModalSheetProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ModalSheet({ children, style }: ModalSheetProps) {
  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalSheet, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  headerTitleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: radius.lg,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: colors.brand,
    fontSize: fontSizes.xs,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.xxl,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  headerAction: {
    alignSelf: "flex-start",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  cardCompact: {
    padding: spacing.md,
  },
  button: {
    minHeight: 52,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
    borderWidth: 1,
  },
  buttonFull: {
    alignSelf: "stretch",
  },
  button_primary: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  button_secondary: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brandSoft,
  },
  button_ghost: {
    backgroundColor: "transparent",
    borderColor: colors.border,
  },
  button_danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerSoft,
  },
  buttonText: {
    fontSize: fontSizes.md,
    fontWeight: "800",
  },
  buttonText_primary: {
    color: colors.white,
  },
  buttonText_secondary: {
    color: colors.brand,
  },
  buttonText_ghost: {
    color: colors.text,
  },
  buttonText_danger: {
    color: colors.danger,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  iconButton_solid: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  iconButton_soft: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brandSoft,
  },
  iconButton_plain: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  iconButton_danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerSoft,
  },
  pressed: {
    opacity: 0.76,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.55,
  },
  fieldWrap: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: "800",
  },
  field: {
    minHeight: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: spacing.md,
    fontSize: fontSizes.md,
  },
  fieldMultiline: {
    minHeight: 104,
    paddingTop: spacing.md,
    textAlignVertical: "top",
  },
  fieldWithIcon: {
    paddingLeft: 42,
  },
  fieldIcon: {
    position: "absolute",
    left: spacing.md,
    top: 14,
    zIndex: 1,
  },
  helper: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
  },
  badge: {
    minHeight: 28,
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  badge_brand: {
    backgroundColor: colors.brandSoft,
  },
  badge_success: {
    backgroundColor: colors.successSoft,
  },
  badge_warning: {
    backgroundColor: colors.warningSoft,
  },
  badge_danger: {
    backgroundColor: colors.dangerSoft,
  },
  badge_neutral: {
    backgroundColor: colors.surfaceMuted,
  },
  badgeText: {
    fontSize: fontSizes.xs,
    fontWeight: "800",
  },
  badgeText_brand: {
    color: colors.brand,
  },
  badgeText_success: {
    color: colors.success,
  },
  badgeText_warning: {
    color: colors.warning,
  },
  badgeText_danger: {
    color: colors.danger,
  },
  badgeText_neutral: {
    color: colors.textMuted,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyCompact: {
    padding: spacing.md,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: "800",
    textAlign: "center",
  },
  emptyDescription: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  infoRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandSoft,
  },
  infoLabel: {
    flex: 0.9,
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    fontWeight: "700",
  },
  infoValue: {
    flex: 1.35,
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: "800",
    textAlign: "right",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.overlay,
  },
  modalSheet: {
    width: "100%",
    maxHeight: "88%",
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.floating,
  },
});
