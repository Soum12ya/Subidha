import React, { useState } from 'react';
import { ROUTES } from '@/routes';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  FileText,
  CreditCard,
  User,
  MapPin,
  Navigation,
  ShieldCheck,
  LogOut,
  ShieldAlert,
  Truck,
  Smartphone,
  Search,
} from 'lucide-react';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { StatusBadge } from '@/components/common/StatusBadge';

export interface NavItemConfig {
  label: string;
  href: string;
  icon?: 'home' | 'tasks' | 'bills' | 'profile' | 'fleet';
}

export interface DashboardShellProps {
  roleLabel: string;
  navItems: NavItemConfig[];
  bottomGridItems?: NavItemConfig[];
  maxFrameWidth?: number;
  children: React.ReactNode;
  onTriggerSos?: () => void;
}


export const DashboardShell: React.FC<DashboardShellProps> = ({
  roleLabel,
  navItems,
  bottomGridItems,
  maxFrameWidth = 1320,
  children,
  onTriggerSos,
}) => {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900; // Desktop Website vs Mobile Inspect breakpoint

  const appState = useAppState();
  const { user, logoutUser, showToast } = appState;

  const [localPermission, setLocalPermission] = useState<'prompt' | 'granted'>('prompt');
  const [localLocationLabel, setLocalLocationLabel] = useState(
    '42 Elm Street, Block C, Sector 14'
  );
  const [manualMode, setManualMode] = useState(false);
  const [customAddress, setCustomAddress] = useState('42 Elm Street, Block C');
  const [showMobileAppBanner, setShowMobileAppBanner] = useState(true);

  const locationPermission =
    (appState as any).locationPermission ?? localPermission;
  const userLocationLabel =
    (appState as any).userLocationLabel ?? localLocationLabel;

  const updateLocationPermission = (
    status: 'prompt' | 'granted',
    addr?: string
  ) => {
    if (typeof (appState as any).setLocationPermission === 'function') {
      (appState as any).setLocationPermission(status, addr);
    }
    setLocalPermission(status);
    if (addr) {
      setLocalLocationLabel(addr);
    } else if (status === 'granted') {
      setLocalLocationLabel('42 Elm Street, Block C (Live GPS Active)');
    }
  };

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const footerItems = bottomGridItems || navItems.slice(0, 4);

  const handleLogout = async () => {
    setDrawerOpen(false);
    try{
      await logoutUser();
      navigate(ROUTES.home, { replace: true });
    } catch{
      showToast('Unable to sign out. Please try again.');
    }
  };

  const handleDownloadApp = () => {
    showToast(
      'The SUBIDHA mobile app is coming soon. Please use our website for now.'
    );
  };

  const renderNavIcon = (iconName: string | undefined, color: string) => {
    switch (iconName) {
      case 'home':
        return <Home size={19} color={color} />;
      case 'tasks':
        return <FileText size={19} color={color} />;
      case 'bills':
        return <CreditCard size={19} color={color} />;
      case 'fleet':
        return <Truck size={19} color={color} />;
      default:
        return <User size={19} color={color} />;
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* MOBILE INSPECT TOP "GET THE APP" BANNER (Matches image_60584b.jpg) */}
      

      {/* STICKY TOP NAVBAR (Wide Blinkit-style on Desktop, Compact on Mobile) */}
      <View
        style={[
          styles.topHeader,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.topHeaderInner}>
          <View style={styles.headerLeft}>
            <Pressable
              onPress={() => setDrawerOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Open Sidebar Menu"
              style={[
                styles.menuButton,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
            >
              <Menu size={20} color={colors.primaryText} />
            </Pressable>

            <AppLogo size={isDesktop ? 'md' : 'sm'} />

            {/* Desktop Inline Location Selector (Like Blinkit Desktop Header) */}
            {isDesktop ? (
              <Pressable
                onPress={() => {
                  setManualMode(false);
                  updateLocationPermission('prompt');
                }}
                style={[
                  styles.desktopLocationBox,
                  { borderLeftColor: colors.border },
                ]}
              >
                <Text style={[styles.deliveryEtaText, { color: colors.primaryText }]}>
                  Assistant ETA: 11 mins
                </Text>
                <View style={styles.locRowInline}>
                  <MapPin size={13} color={colors.primaryAccent} />
                  <Text
                    numberOfLines={1}
                    style={[styles.locAddressText, { color: colors.secondaryText }]}
                  >
                    {userLocationLabel} ▾
                  </Text>
                </View>
              </Pressable>
            ) : null}
          </View>

          {/* Desktop Center Search Bar (Like Blinkit image_60580f.jpg) */}
          {isDesktop ? (
            <View
              style={[
                styles.desktopSearchBar,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <Search size={16} color={colors.secondaryText} />
              <Text style={{ color: colors.secondaryText, fontSize: 13 }}>
                Search "medical escort", "pharmacy pickup", or "dispatch task"...
              </Text>
            </View>
          ) : null}

          <View style={styles.headerRight}>
            {isDesktop ? (
              <Pressable
                onPress={handleDownloadApp}
                style={[
                  styles.downloadAppHeaderBtn,
                  { backgroundColor: colors.badgeBg, borderColor: colors.border },
                ]}
              >
                <Smartphone size={15} color={colors.primaryAccent} />
                <Text
                  style={{
                    color: colors.primaryAccent,
                    fontSize: 12,
                    fontWeight: '800',
                  }}
                >
                  Download Mobile App
                </Text>
              </Pressable>
            ) : null}
            <ThemeToggle />
          </View>
        </View>
      </View>

      {/* MOBILE SUB-HEADER: Location Strip (Visible only on Mobile / Inspect View) */}
      {!isDesktop ? (
        <Pressable
          onPress={() => {
            setManualMode(false);
            updateLocationPermission('prompt');
          }}
          style={[
            styles.mobileLocationBar,
            {
              backgroundColor: colors.secondaryBackground,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.mobileEtaTitle, { color: colors.primaryText }]}>
              Assistance in 11 minutes
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} color={colors.primaryAccent} />
              <Text
                numberOfLines={1}
                style={[styles.mobileLocSub, { color: colors.secondaryText }]}
              >
                {userLocationLabel} ▾
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.mobileUserBadge,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
          >
            <User size={16} color={colors.primaryText} />
          </View>
        </Pressable>
      ) : null}

      {/* BODY AREA: Persistent Left Sidebar on Desktop + Wide Content Area */}
      <View style={styles.bodyWrapper}>
        {isDesktop ? (
          <View
            style={[
              styles.desktopSidebar,
              {
                backgroundColor: colors.secondaryBackground,
                borderRightColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.sidebarProfileBox,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
            >
              <StatusBadge label={roleLabel} />
              <Text style={[styles.sidebarUserName, { color: colors.primaryText }]}>
                {user
                  ? user.role === 'customer'
                    ? user.fullName
                    : user.businessName
                  : 'Member'}
              </Text>
              {user ? (
                <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                  +91 {user.phone} • {user.city}
                </Text>
              ) : null}
            </View>

            <View style={styles.desktopNavList}>
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Pressable
                    key={item.href}
                    onPress={() => navigate(item.href as any)}
                    style={[
                      styles.desktopNavItem,
                      {
                        backgroundColor: active
                          ? colors.cardBackground
                          : 'transparent',
                        borderColor: active ? colors.primaryAccent : 'transparent',
                      },
                    ]}
                  >
                    {renderNavIcon(
                      item.icon,
                      active ? colors.primaryAccent : colors.secondaryText
                    )}
                    <Text
                      style={{
                        color: active ? colors.primaryAccent : colors.primaryText,
                        fontWeight: active ? '800' : '600',
                        fontSize: 14,
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={[styles.sidebarFooter, { borderTopColor: colors.border }]}>
              {onTriggerSos ? (
                <Pressable
                  onPress={onTriggerSos}
                  style={[styles.sosSidebarBtn, { backgroundColor: colors.sos }]}
                >
                  <ShieldAlert size={16} color="#FFFFFF" />
                  <Text style={styles.sosSidebarText}>Emergency SOS</Text>
                </Pressable>
              ) : null}

              <Pressable onPress={handleLogout} style={styles.logoutSidebarBtn}>
                <LogOut size={16} color={colors.sos} />
                <Text style={{ color: colors.sos, fontWeight: '700', fontSize: 13 }}>
                  Sign Out
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* MAIN SCROLLABLE CONTENT */}
        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={[
            styles.mainScrollContent,
            {
              paddingHorizontal: isDesktop ? 32 : 14,
              paddingTop: isDesktop ? 28 : 14,
              paddingBottom: isDesktop ? 28 : 20,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View 
          style={[
            styles.wideContainer,
            { maxWidth: maxFrameWidth },
            ]}>
              {children}
          </View>
        </ScrollView>
      </View>

      {/* MOBILE BOTTOM 4-ICON GRID FOOTER (Visible on Mobile / Inspect View < 900px) */}
      {!isDesktop ? (
        <View
          style={[
            styles.bottomFooterGrid,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
          {footerItems.map((item) => {
            const active = pathname === item.href;
            const tint = active ? colors.primaryAccent : colors.secondaryText;
            return (
              <Pressable
                key={item.href}
                onPress={() => navigate(item.href as any)}
                style={styles.footerGridCell}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                {renderNavIcon(item.icon, tint)}
                <Text
                  numberOfLines={1}
                  style={[
                    styles.footerGridLabel,
                    {
                      color: tint,
                      fontWeight: active ? '800' : '600',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {/* SLIDE-OUT SIDEBAR DRAWER (When clicking Menu Button on Mobile or Desktop) */}
      <Modal
        visible={drawerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View style={[styles.drawerBackdrop, { backgroundColor: colors.overlay }]}>
          <View
            style={[
              styles.drawerPanel,
              {
                backgroundColor: colors.background,
                borderRightColor: colors.border,
              },
            ]}
          >
            <View style={styles.drawerHeader}>
              <AppLogo size="md" disableLink />
              <Pressable
                onPress={() => setDrawerOpen(false)}
                style={[styles.closeBtn, { borderColor: colors.border }]}
              >
                <X size={18} color={colors.primaryText} />
              </Pressable>
            </View>

            <View
              style={[
                styles.sidebarProfileBox,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
            >
              <StatusBadge label={roleLabel} />
              <Text style={[styles.sidebarUserName, { color: colors.primaryText }]}>
                {user
                  ? user.role === 'customer'
                    ? user.fullName
                    : user.businessName
                  : 'Guest'}
              </Text>
            </View>

            <View style={styles.desktopNavList}>
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Pressable
                    key={item.href}
                    onPress={() => {
                      setDrawerOpen(false);
                      navigate(item.href as any);
                    }}
                    style={[
                      styles.desktopNavItem,
                      {
                        backgroundColor: active
                          ? colors.cardBackground
                          : 'transparent',
                        borderColor: active ? colors.primaryAccent : 'transparent',
                      },
                    ]}
                  >
                    {renderNavIcon(
                      item.icon,
                      active ? colors.primaryAccent : colors.secondaryText
                    )}
                    <Text
                      style={{
                        color: active ? colors.primaryAccent : colors.primaryText,
                        fontWeight: active ? '800' : '600',
                        fontSize: 14,
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={[styles.sidebarFooter, { borderTopColor: colors.border }]}>
              <Pressable
                onPress={handleDownloadApp}
                style={[
                  styles.sosSidebarBtn,
                  { backgroundColor: colors.primaryAccent },
                ]}
              >
                <Smartphone size={16} color="#FFFFFF" />
                <Text style={styles.sosSidebarText}>Download Mobile App</Text>
              </Pressable>

              <Pressable onPress={handleLogout} style={styles.logoutSidebarBtn}>
                <LogOut size={16} color={colors.sos} />
                <Text style={{ color: colors.sos, fontWeight: '700', fontSize: 14 }}>
                  Sign Out
                </Text>
              </Pressable>
            </View>
          </View>
          <Pressable style={{ flex: 1 }} onPress={() => setDrawerOpen(false)} />
        </View>
      </Modal>

      {/* RAPIDO / BLINKIT LOCATION PERMISSION MODAL */}
      <Modal
        visible={locationPermission === 'prompt'}
        transparent
        animationType="slide"
        onRequestClose={() => updateLocationPermission('granted')}
      >
        <View style={[styles.locBackdrop, { backgroundColor: colors.overlay }]}>
          <View
            style={[
              styles.locSheet,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={[styles.pinCircle, { backgroundColor: colors.badgeBg }]}>
              <MapPin size={32} color={colors.primaryAccent} />
            </View>
            <Text style={[styles.locTitle, { color: colors.primaryText }]}>
              Enable Location Services
            </Text>
            <Text style={[styles.locSubtitle, { color: colors.secondaryText }]}>
              SUBIDHA uses your live location to assign the nearest verified assistant (0.8 km radius) and calculate exact doorstep pickup ETA.
            </Text>

            <View
              style={[
                styles.locInfoBox,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.locBulletRow}>
                <Navigation size={16} color={colors.primaryAccent} />
                <Text style={[styles.locBulletText, { color: colors.primaryText }]}>
                  Instant doorstep pickup & live rider radar tracking
                </Text>
              </View>
              <View style={styles.locBulletRow}>
                <ShieldCheck size={16} color={colors.primaryAccent} />
                <Text style={[styles.locBulletText, { color: colors.primaryText }]}>
                  Automatic GPS coordinates shared during SOS alerts
                </Text>
              </View>
            </View>

            {manualMode ? (
              <View style={styles.manualWrapper}>
                <TextInput
                  value={customAddress}
                  onChangeText={setCustomAddress}
                  placeholder="Enter address manually..."
                  placeholderTextColor={colors.secondaryText}
                  style={[
                    styles.manualInput,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.primaryText,
                    },
                  ]}
                />
                <Pressable
                  onPress={() =>
                    updateLocationPermission(
                      'granted',
                      customAddress.trim() || '42 Elm Street, Block C'
                    )
                  }
                  style={[styles.allowBtn, { backgroundColor: colors.primaryAccent }]}
                >
                  <Text style={styles.allowBtnText}>Confirm Manual Location</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.locButtonStack}>
                <Pressable
                  onPress={() => updateLocationPermission('granted')}
                  style={[styles.allowBtn, { backgroundColor: colors.primaryAccent }]}
                >
                  <Navigation size={17} color="#FFFFFF" />
                  <Text style={styles.allowBtnText}>Allow While Using App</Text>
                </Pressable>
                <Pressable
                  onPress={() => setManualMode(true)}
                  style={[
                    styles.manualBtn,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.manualBtnText, { color: colors.primaryText }]}>
                    Select Location Manually
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DashboardShell;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: 0,
    overflow: 'hidden',
  },
  getAppBanner: {
    backgroundColor: '#15803D',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  getAppLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appBadgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FDE047',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getAppTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  getAppSub: {
    color: '#DCFCE7',
    fontSize: 11,
  },
  useAppBtn: {
    backgroundColor: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  useAppBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  topHeader: {
    borderBottomWidth: 1,
    width: '100%',
  },
  topHeaderInner: {
    maxWidth: 1420,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopLocationBox: {
    borderLeftWidth: 1,
    paddingLeft: 16,
    marginLeft: 4,
    maxWidth: 260,
  },
  deliveryEtaText: {
    fontSize: 14,
    fontWeight: '900',
  },
  locRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locAddressText: {
    fontSize: 12,
  },
  desktopSearchBar: {
    flex: 1,
    maxWidth: 520,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  downloadAppHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  mobileLocationBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mobileEtaTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  mobileLocSub: {
    fontSize: 12,
  },
  mobileUserBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyWrapper: {
    flex: 1,
    minHeight: 0,
    flexDirection: 'row',
    width: '100%',
  },
  desktopSidebar: {
    width: 260,
    borderRightWidth: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  sidebarProfileBox: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
    marginBottom: 16,
  },
  sidebarUserName: {
    fontSize: 16,
    fontWeight: '800',
  },
  desktopNavList: {
    flex: 1,
    gap: 6,
  },
  desktopNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  sidebarFooter: {
    borderTopWidth: 1,
    paddingTop: 14,
    gap: 10,
  },
  sosSidebarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderRadius: 10,
  },
  sosSidebarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  logoutSidebarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  mainScroll: {
    flex: 1,
    minHeight: 0,
    width: '100%',
  },
  mainScrollContent: {
    width: '100%',
  },
  wideContainer: {
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
    minWidth: 0,
  },
  bottomFooterGrid: {
    flexShrink: 0,
    zIndex: 20,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 9,
    paddingBottom: 9,
    paddingHorizontal: 8,
    minHeight: 66,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerGridCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  footerGridLabel: {
    fontSize: 11,
  },
  drawerBackdrop: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerPanel: {
    width: 300,
    maxWidth: '84%',
    height: '100%',
    borderRightWidth: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeBtn: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  locBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  locSheet: {
    width: '100%',
    maxWidth: 480,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  pinCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locTitle: {
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  locSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  locInfoBox: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  locBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locBulletText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  locButtonStack: {
    width: '100%',
    gap: 10,
    marginTop: 4,
  },
  allowBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  allowBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  manualBtn: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  manualWrapper: {
    width: '100%',
    gap: 10,
  },
  manualInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
});