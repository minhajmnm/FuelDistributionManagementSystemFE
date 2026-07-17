<template>
  <!-- Wrapper for all statistic cards -->
  <div class="stats-row">
    
    <!-- Loop through each card object passed via props -->
    <div
      v-for="card in cards"
      :key="card.label" 
      class="stat-card-dashboard"
    >
      
      <!-- Decorative gradient bar (top/side styling element) -->
      <div class="gradient-bar" />
      
      <!-- Content section of the card -->
      <div class="stat-content">
        
        <!-- Display numeric/stat value -->
        <div class="stat-number">{{ card.value }}</div>
        
        <!-- Display label/description -->
        <div class="stat-label">{{ card.label }}</div>
      
      </div>
    </div>

  </div>
</template>

<script>
export default {
  // Component name for reuse/import
  name: 'StatsRow',

  // Props received from parent component
  props: {
    cards: {
      type: Array,     
      required: true,  
    },
  },
}
</script>
<style scoped>

/*  CONTAINER FOR ALL STAT CARDS  */
.stats-row {
  display: flex;          
  flex-wrap: wrap;        
  gap: 16px;             
  margin-bottom: 27px;    
}

/* INDIVIDUAL STAT CARD  */
.stat-card-dashboard {
  box-sizing: border-box;      
  position: relative;           
  display: flex;
  flex-direction: column;      
  align-items: flex-start;      
  padding: 20px 24px;           
  gap: 3.19px;                 
  isolation: isolate;           
  width: 247px;               
  min-height: 80px;            
  background: #ffffff;         
  border: 1px solid #820000;    
  border-radius: 11px;          
  overflow: hidden;            
}

/*  GRADIENT BAR */
.gradient-bar {
  position: absolute;           
  height: 4px;                 
  left: 0;
  right: 0;
  top: 0;                    
  background: linear-gradient(
    90deg,
    #b60106 0%,              
    #820000 100%               
  );
  border-radius: 11px 11px 0px 0px; 
  z-index: 2;                 
}

/* CONTENT WRAPPER */
.stat-content {
  display: flex;
  flex-direction: column;     
  align-items: flex-start;
  padding: 0;
  gap: 3.19px;
  width: 100%;
  z-index: 0;
  margin-top: 6px;             
}

/* STAT NUMBER */
.stat-number {
  width: 100%;
  height: 24px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;           
  font-size: 24px;             
  line-height: 24px;
  display: flex;
  align-items: center;
  letter-spacing: -0.72px;    
  color: #1a1a1a;              
}

/* TAT LABEL */
.stat-label {
  width: 100%;
  height: 19px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;            
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  color: #7a7974;              
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .stats-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    width: 100%;
  }

  .stat-card-dashboard {
    width: 100%;
    min-height: 84px;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .stat-card-dashboard {
    flex: 1 1 calc(50% - 16px);
    width: auto;
  }
}


</style>