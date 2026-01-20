import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Linking,
  Platform,
  ViewStyle,
} from "react-native";

type Status = "sent" | "delivered" | "read";

export type WAAction = {
  id: string;
  label: string;
  onPress?: () => void;
  url?: string;
};

export type WALink = {
  id: string;
  title: string;
  url: string;
  subtitle?: string;
};

type Props = {
  align?: "left" | "right";
  showTail?: boolean;

  // Sections: can be any node (image/text/custom) or null
  header?: React.ReactNode | null;
  body?: React.ReactNode | string;
  footer?: React.ReactNode | null;

  actions?: WAAction[];
  links?: WALink[];

  timestamp?: string; // "9:21 PM"
  status?: Status; // outgoing only

  // tuning
  maxWidth?: number; // default 330
  style?: ViewStyle;
};

export function TemplateMessage({
  align = "right",
  showTail = true,
  header = null,
  body = "",
  footer = null,
  actions,
  links,
  timestamp,
  status,
  maxWidth = 330,
  style,
}: Props) {
  const isRight = align === "right";

  const bubbleBg = isRight ? "#DCF8C6" : "#FFFFFF";
  const borderColor = isRight ? "#CDEBBE" : "#E9E9E9";

  const ticks = (() => {
    if (!isRight || !status) return null;
    if (status === "sent") return { text: "✓", color: "#94A3B8" };
    if (status === "delivered") return { text: "✓✓", color: "#94A3B8" };
    return { text: "✓✓", color: "#1D9BF0" }; // read: bluish
  })();

  const openUrl = async (url: string) => {
    try {
      const ok = await Linking.canOpenURL(url);
      if (ok) await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  return (
    <View style={[styles.row, isRight ? styles.rowRight : styles.rowLeft]}>
      <View style={{ width: "100%", maxWidth, alignSelf: isRight ? "flex-end" : "flex-start" }}>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: bubbleBg,
              borderColor,
            },
            style,
          ]}
        >
          {/* Tail */}
          {showTail ? (
            <View
              style={[
                styles.tail,
                isRight ? styles.tailRight : styles.tailLeft,
                { backgroundColor: bubbleBg, borderColor },
              ]}
            />
          ) : null}

          {/* Header (full bleed) */}
          {header ? <View style={styles.headerWrap}>{header}</View> : null}

          {/* Body */}
          <View style={styles.bodyWrap}>
            {typeof body === "string" ? (
              <Text style={styles.bodyText}>{body}</Text>
            ) : (
              body
            )}
          </View>

          {/* Links (WhatsApp-like cards) */}
          {links?.length ? (
            <View style={styles.linksWrap}>
              {links.map((l, idx) => (
                <Pressable
                  key={l.id}
                  onPress={() => openUrl(l.url)}
                  style={({ pressed }) => [
                    styles.linkRow,
                    idx !== links.length - 1 && styles.divider,
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <Text style={styles.linkTitle}>{l.title}</Text>
                  {l.subtitle ? <Text style={styles.linkSubtitle}>{l.subtitle}</Text> : null}
                  <Text numberOfLines={1} style={styles.linkUrl}>
                    {l.url}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {/* Footer */}
          {footer ? <View style={styles.footerWrap}>{footer}</View> : null}

          {/* Actions (WhatsApp template buttons) */}
          {actions?.length ? (
            <View style={styles.actionsWrap}>
              {actions.map((a, idx) => (
                <Pressable
                  key={a.id}
                  onPress={() => {
                    if (a.onPress) return a.onPress();
                    if (a.url) return openUrl(a.url);
                  }}
                  style={({ pressed }) => [
                    styles.actionRow,
                    idx !== actions.length - 1 && styles.divider,
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <Text style={styles.actionText}>{a.label}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {/* Meta inside bubble (bottom-right) */}
          {(timestamp || ticks) ? (
            <View style={styles.metaRow}>
              {timestamp ? <Text style={styles.metaText}>{timestamp}</Text> : null}
              {ticks ? <Text style={[styles.metaText, { marginLeft: 6, color: ticks.color }]}>{ticks.text}</Text> : null}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

/** Header helper: full-bleed image with rounded top corners */
export function TemplateHeaderImage({
  uri,
  height = 160,
}: {
  uri: string;
  height?: number;
}) {
  return (
    <Image
      source={{ uri }}
      resizeMode="cover"
      style={{
        width: "100%",
        height,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
    />
  );
}

/** Title helper */
export function TemplateTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

/** Note helper */
export function TemplateNote({ children }: { children: React.ReactNode }) {
  return <Text style={styles.note}>{children}</Text>;
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 6,
    flexDirection: "row",
  },
  rowRight: { justifyContent: "flex-end" },
  rowLeft: { justifyContent: "flex-start" },

  bubble: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
      default: {},
    }),
  },

  // Tail is a small rotated square
  tail: {
    position: "absolute",
    width: 14,
    height: 14,
    borderWidth: 1,
    transform: [{ rotate: "45deg" }],
    top: 14,
  },
  tailRight: { right: -7, borderLeftWidth: 0, borderBottomWidth: 0 },
  tailLeft: { left: -7, borderRightWidth: 0, borderTopWidth: 0 },

  headerWrap: {
    // header is full-bleed, so no padding here
  },

  bodyWrap: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#0F172A",
  },

  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  note: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 6,
  },

  linksWrap: {
    marginHorizontal: 12,
    marginTop: 2,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  linkRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  linkTitle: { fontSize: 14, fontWeight: "800", color: "#0B5FFF" },
  linkSubtitle: { fontSize: 12, color: "#334155", marginTop: 2 },
  linkUrl: { fontSize: 12, color: "#94A3B8", marginTop: 2 },

  footerWrap: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },

  actionsWrap: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  actionRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0B5FFF",
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  metaRow: {
    position: "absolute",
    right: 10,
    bottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 11,
    color: "#64748B",
  },
});
