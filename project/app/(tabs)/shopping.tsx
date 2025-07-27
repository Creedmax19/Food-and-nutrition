import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ShoppingCart,
  Plus,
  Check,
  MapPin,
  DollarSign,
  Clock,
  Search,
  Filter,
  X,
  Store,
  Navigation
} from 'lucide-react-native';

export default function ShoppingScreen() {
  const [activeTab, setActiveTab] = useState('list');
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [showMarketModal, setShowMarketModal] = useState(false);

  const [shoppingList, setShoppingList] = useState([
    {
      id: 1,
      name: 'Jasmine Rice',
      quantity: '2 cups',
      category: 'Grains',
      checked: false,
      price: 450,
      currency: 'NGN',
      alternatives: ['Basmati Rice', 'Long Grain Rice'],
      markets: ['Balogun Market', 'Mile 12 Market']
    },
    {
      id: 2,
      name: 'Fresh Tomatoes',
      quantity: '6 pieces',
      category: 'Vegetables',
      checked: true,
      price: 200,
      currency: 'NGN',
      alternatives: ['Canned Tomatoes'],
      markets: ['Oyingbo Market', 'Mushin Market']
    },
    {
      id: 3,
      name: 'Chicken Breast',
      quantity: '1 kg',
      category: 'Protein',
      checked: false,
      price: 2500,
      currency: 'NGN',
      alternatives: ['Chicken Thighs', 'Turkey'],
      markets: ['Ikeja Market', 'Agege Market']
    },
    {
      id: 4,
      name: 'Palm Oil',
      quantity: '500ml',
      category: 'Oils & Spices',
      checked: false,
      price: 800,
      currency: 'NGN',
      alternatives: ['Vegetable Oil', 'Groundnut Oil'],
      markets: ['Alaba Market', 'Oke-Arin Market']
    },
    {
      id: 5,
      name: 'Scotch Bonnet Peppers',
      quantity: '10 pieces',
      category: 'Spices',
      checked: false,
      price: 150,
      currency: 'NGN',
      alternatives: ['Habanero Peppers', 'Cayenne Peppers'],
      markets: ['Balogun Market', 'Oyingbo Market']
    }
  ]);

  const [nearbyMarkets] = useState([
    {
      id: 1,
      name: 'Balogun Market',
      distance: '2.3 km',
      rating: 4.2,
      openTime: '6:00 AM - 8:00 PM',
      specialties: ['Spices', 'Grains', 'Vegetables'],
      priceRange: 'Budget-friendly',
      address: 'Lagos Island, Lagos',
      phone: '+234 803 123 4567'
    },
    {
      id: 2,
      name: 'Mile 12 Market',
      distance: '5.1 km',
      rating: 4.5,
      openTime: '5:00 AM - 9:00 PM',
      specialties: ['Fresh Produce', 'Fruits', 'Vegetables'],
      priceRange: 'Wholesale prices',
      address: 'Kosofe, Lagos',
      phone: '+234 805 987 6543'
    },
    {
      id: 3,
      name: 'Oyingbo Market',
      distance: '3.7 km',
      rating: 4.0,
      openTime: '6:30 AM - 7:30 PM',
      specialties: ['Meat', 'Fish', 'Poultry'],
      priceRange: 'Moderate',
      address: 'Ebute Metta, Lagos',
      phone: '+234 807 456 7890'
    },
    {
      id: 4,
      name: 'Mushin Market',
      distance: '4.2 km',
      rating: 3.8,
      openTime: '7:00 AM - 8:00 PM',
      specialties: ['Household Items', 'Grains', 'Spices'],
      priceRange: 'Budget-friendly',
      address: 'Mushin, Lagos',
      phone: '+234 809 234 5678'
    }
  ]);

  const categories = ['All', 'Grains', 'Vegetables', 'Protein', 'Oils & Spices', 'Fruits'];

  const toggleItemCheck = (itemId) => {
    setShoppingList(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const addNewItem = () => {
    if (newItemName.trim()) {
      const newItem = {
        id: Date.now(),
        name: newItemName,
        quantity: '1 piece',
        category: 'Other',
        checked: false,
        price: 0,
        currency: 'NGN',
        alternatives: [],
        markets: []
      };
      setShoppingList(prev => [...prev, newItem]);
      setNewItemName('');
      setShowAddItem(false);
    }
  };

  const getTotalPrice = () => {
    return shoppingList.reduce((total, item) => total + item.price, 0);
  };

  const getCheckedItems = () => {
    return shoppingList.filter(item => item.checked).length;
  };

  const getCategoryItems = (category) => {
    if (category === 'All') return shoppingList;
    return shoppingList.filter(item => item.category === category);
  };

  const openMarketDetails = (market) => {
    setSelectedMarket(market);
    setShowMarketModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#3D5A80', '#264653']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Smart Shopping</Text>
          <Text style={styles.headerSubtitle}>Find ingredients at the best local markets</Text>
        </View>
        <View style={styles.headerStats}>
          <Text style={styles.statText}>{getCheckedItems()}/{shoppingList.length} items</Text>
          <Text style={styles.statText}>₦{getTotalPrice().toLocaleString()}</Text>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && styles.activeTab]}
          onPress={() => setActiveTab('list')}>
          <ShoppingCart size={20} color={activeTab === 'list' ? '#FFFFFF' : '#8B7355'} />
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
            Shopping List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'markets' && styles.activeTab]}
          onPress={() => setActiveTab('markets')}>
          <Store size={20} color={activeTab === 'markets' ? '#FFFFFF' : '#8B7355'} />
          <Text style={[styles.tabText, activeTab === 'markets' && styles.activeTabText]}>
            Nearby Markets
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'list' ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Shopping Progress</Text>
              <Text style={styles.progressText}>
                {getCheckedItems()} of {shoppingList.length} items completed
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(getCheckedItems() / shoppingList.length) * 100}%` }
                ]} 
              />
            </View>
          </View>

          {/* Category Filter */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}>
            {categories.map((category) => (
              <TouchableOpacity key={category} style={styles.categoryChip}>
                <Text style={styles.categoryChipText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Shopping List Items */}
          <View style={styles.listContainer}>
            {categories.map((category) => {
              const categoryItems = getCategoryItems(category);
              if (category === 'All' || categoryItems.length === 0) return null;

              return (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  {categoryItems.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.listItem, item.checked && styles.checkedItem]}
                      onPress={() => toggleItemCheck(item.id)}>
                      <View style={styles.itemLeft}>
                        <TouchableOpacity
                          style={[styles.checkbox, item.checked && styles.checkedBox]}
                          onPress={() => toggleItemCheck(item.id)}>
                          {item.checked && <Check size={16} color="#FFFFFF" />}
                        </TouchableOpacity>
                        <View style={styles.itemInfo}>
                          <Text style={[styles.itemName, item.checked && styles.checkedText]}>
                            {item.name}
                          </Text>
                          <Text style={styles.itemQuantity}>{item.quantity}</Text>
                          {item.alternatives.length > 0 && (
                            <Text style={styles.alternatives}>
                              Alt: {item.alternatives.join(', ')}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.itemRight}>
                        <Text style={styles.itemPrice}>₦{item.price}</Text>
                        <View style={styles.marketCount}>
                          <MapPin size={12} color="#8B7355" />
                          <Text style={styles.marketCountText}>{item.markets.length}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })}
          </View>

          {/* Add Item Button */}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddItem(true)}>
            <Plus size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="#8B7355" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search markets..."
                placeholderTextColor="#8B7355"
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#E07A5F" />
            </TouchableOpacity>
          </View>

          {/* Markets List */}
          <View style={styles.marketsContainer}>
            {nearbyMarkets.map((market) => (
              <TouchableOpacity
                key={market.id}
                style={styles.marketCard}
                onPress={() => openMarketDetails(market)}>
                <View style={styles.marketHeader}>
                  <View style={styles.marketInfo}>
                    <Text style={styles.marketName}>{market.name}</Text>
                    <View style={styles.marketMeta}>
                      <MapPin size={14} color="#8B7355" />
                      <Text style={styles.marketDistance}>{market.distance}</Text>
                      <Text style={styles.marketRating}>★ {market.rating}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.navigationButton}>
                    <Navigation size={20} color="#E07A5F" />
                  </TouchableOpacity>
                </View>

                <View style={styles.marketDetails}>
                  <View style={styles.marketDetailItem}>
                    <Clock size={14} color="#8B7355" />
                    <Text style={styles.marketDetailText}>{market.openTime}</Text>
                  </View>
                  <View style={styles.marketDetailItem}>
                    <DollarSign size={14} color="#8B7355" />
                    <Text style={styles.marketDetailText}>{market.priceRange}</Text>
                  </View>
                </View>

                <View style={styles.specialties}>
                  {market.specialties.map((specialty, index) => (
                    <View key={index} style={styles.specialtyTag}>
                      <Text style={styles.specialtyText}>{specialty}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Add Item Modal */}
      <Modal
        visible={showAddItem}
        animationType="slide"
        presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Item</Text>
            <TouchableOpacity onPress={() => setShowAddItem(false)}>
              <X size={24} color="#2C1810" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              style={styles.itemInput}
              placeholder="Enter item name..."
              value={newItemName}
              onChangeText={setNewItemName}
              autoFocus
            />
            
            <TouchableOpacity style={styles.addItemButton} onPress={addNewItem}>
              <Text style={styles.addItemButtonText}>Add to List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Market Details Modal */}
      <Modal
        visible={showMarketModal}
        animationType="slide"
        presentationStyle="pageSheet">
        {selectedMarket && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedMarket.name}</Text>
              <TouchableOpacity onPress={() => setShowMarketModal(false)}>
                <X size={24} color="#2C1810" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.marketDetailCard}>
                <View style={styles.marketDetailRow}>
                  <MapPin size={20} color="#E07A5F" />
                  <View style={styles.marketDetailInfo}>
                    <Text style={styles.marketDetailLabel}>Address</Text>
                    <Text style={styles.marketDetailValue}>{selectedMarket.address}</Text>
                  </View>
                </View>

                <View style={styles.marketDetailRow}>
                  <Clock size={20} color="#3D5A80" />
                  <View style={styles.marketDetailInfo}>
                    <Text style={styles.marketDetailLabel}>Opening Hours</Text>
                    <Text style={styles.marketDetailValue}>{selectedMarket.openTime}</Text>
                  </View>
                </View>

                <View style={styles.marketDetailRow}>
                  <DollarSign size={20} color="#F4A261" />
                  <View style={styles.marketDetailInfo}>
                    <Text style={styles.marketDetailLabel}>Price Range</Text>
                    <Text style={styles.marketDetailValue}>{selectedMarket.priceRange}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.specialtiesSection}>
                <Text style={styles.specialtiesTitle}>Specialties</Text>
                <View style={styles.specialtiesGrid}>
                  {selectedMarket.specialties.map((specialty, index) => (
                    <View key={index} style={styles.specialtyCard}>
                      <Text style={styles.specialtyCardText}>{specialty}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.primaryButton}>
                  <Navigation size={20} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Get Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Call Market</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    color: '#F2CC8F',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#E07A5F',
  },
  tabText: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
  },
  progressText: {
    fontSize: 12,
    color: '#8B7355',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E07A5F',
    borderRadius: 4,
  },
  categoriesContainer: {
    maxHeight: 50,
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#8B7355',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  checkedItem: {
    opacity: 0.6,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#E07A5F',
    borderColor: '#E07A5F',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 2,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#8B7355',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 2,
  },
  alternatives: {
    fontSize: 10,
    color: '#E07A5F',
    fontStyle: 'italic',
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3D5A80',
    marginBottom: 4,
  },
  marketCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  marketCountText: {
    fontSize: 12,
    color: '#8B7355',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E07A5F',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C1810',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  marketsContainer: {
    paddingHorizontal: 20,
  },
  marketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  marketInfo: {
    flex: 1,
  },
  marketName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  marketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  marketDistance: {
    fontSize: 12,
    color: '#8B7355',
  },
  marketRating: {
    fontSize: 12,
    color: '#F4A261',
    fontWeight: '600',
  },
  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marketDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  marketDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  marketDetailText: {
    fontSize: 12,
    color: '#8B7355',
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: '#F2CC8F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 10,
    color: '#2C1810',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  itemInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addItemButton: {
    backgroundColor: '#E07A5F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addItemButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  marketDetailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  marketDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  marketDetailInfo: {
    marginLeft: 12,
    flex: 1,
  },
  marketDetailLabel: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 2,
  },
  marketDetailValue: {
    fontSize: 16,
    color: '#2C1810',
    fontWeight: '600',
  },
  specialtiesSection: {
    marginBottom: 20,
  },
  specialtiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  specialtyCard: {
    backgroundColor: '#F2CC8F',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  specialtyCardText: {
    fontSize: 14,
    color: '#2C1810',
    fontWeight: '600',
  },
  actionButtons: {
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E07A5F',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#E07A5F',
  },
  secondaryButtonText: {
    color: '#E07A5F',
    fontSize: 16,
    fontWeight: '600',
  },
});